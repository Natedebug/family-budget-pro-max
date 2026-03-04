import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import BudgetOverview from './BudgetOverview';
import CategoryCard from './CategoryCard';
import Button from '../ui/Button';
import { PlusIcon, SparklesIcon } from '../ui/Icon';
import { BudgetCategory, View } from '../../types';
import AddCategoryModal from './AddCategoryModal';
import CategoryDetailView from './CategoryDetailView';
import CategoryGroupCard from './CategoryGroupCard';
import UserSwitcher from '../layout/UserSwitcher';
import EndMonthRolloverModal from './EndMonthRolloverModal';
import AddExpenseFlow from './AddExpenseFlow';
import { GoogleGenAI } from '@google/genai';
import GeminiSummary from './GeminiSummary';

interface BudgetDashboardProps {
  setCurrentView: (view: View) => void;
}

const BudgetDashboard: React.FC<BudgetDashboardProps> = ({ setCurrentView }) => {
  const { budgetCategories, categoryGroups, currentUser, income, transactions } = useAppContext();
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<BudgetCategory | null>(null);
  const [viewingCategoryId, setViewingCategoryId] = useState<string | null>(null);
  const [isBudgetManagerModalOpen, setBudgetManagerModalOpen] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  const formattedAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    setSummary(null);

    const visibleCategories = budgetCategories.filter(c => !c.ownerId || c.ownerId === currentUser.id);

    const budgetDetails = visibleCategories
        .map(cat => `- ${cat.name}: Spent ${formattedAmount(cat.spent)} of ${formattedAmount(cat.allocated)}`)
        .join('\n');
    
    const recentTransactions = transactions
        .filter(t => visibleCategories.some(c => c.id === t.categoryId))
        .slice(0, 5)
        .map(tx => `- ${tx.merchant}: ${formattedAmount(tx.amount)}`)
        .join('\n');

    const prompt = `
      You are a friendly and insightful financial assistant for a family. 
      Based on the following monthly budget data, provide a concise summary of our financial health.

      Your summary should:
      1. Start with a positive and encouraging opening for the user, ${currentUser.name}.
      2. Highlight 1-2 categories where spending is well under control.
      3. Gently point out 1-2 categories that are over budget or close to the limit.
      4. Offer one simple, actionable tip for improvement based on the data.
      5. Keep the entire summary to about 3-4 short paragraphs.
      6. Format the output using markdown for readability (e.g., use bold for category names, bullet points for lists).

      Here is the data:
      - Monthly Income: ${formattedAmount(income)}
      - User: ${currentUser.name}

      Budget Categories Status:
      ${budgetDetails}

      Recent Transactions (for context):
      ${recentTransactions}
    `;

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        setSummary(response.text);
    } catch (error) {
        console.error("Error generating budget summary:", error);
        setSummary("Sorry, I couldn't generate a summary at this time. Please try again later.");
    } finally {
        setIsGeneratingSummary(false);
    }
  };


  const {
    visibleCategories,
    visibleGroups,
    ungroupedCategories,
  } = useMemo(() => {
    // Determine visible categories based on user role
    const baseVisibleCategories = budgetCategories.filter(c => {
        if (currentUser.role === 'admin') return true;
        // Member sees shared + own. Kid sees only own.
        return !c.ownerId || c.ownerId === currentUser.id;
    });
    
    const visibleCategoryIds = new Set(baseVisibleCategories.map(c => c.id));

    // Filter groups and ungrouped categories from the visible set
    const categorizedIds = new Set(categoryGroups.flatMap(g => g.categoryIds));
    const ungroupedCategories = baseVisibleCategories.filter(c => !categorizedIds.has(c.id));
    
    const visibleGroups = categoryGroups.map(group => ({
        ...group,
        categoryIds: group.categoryIds.filter(id => visibleCategoryIds.has(id))
    })).filter(group => group.categoryIds.length > 0);

    return {
      visibleCategories: baseVisibleCategories,
      visibleGroups,
      ungroupedCategories,
    };
  }, [currentUser, budgetCategories, categoryGroups]);

  const handleOpenCreateCategoryModal = () => {
    setCategoryToEdit(null);
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategoryModal = (category: BudgetCategory) => {
    setCategoryToEdit(category);
    setIsCategoryModalOpen(true);
  };

  const handleCloseCategoryModal = () => {
    setIsCategoryModalOpen(false);
    setCategoryToEdit(null);
  };
  
  const handleSelectCategory = (categoryId: string) => {
    if (categoryId === 'subscriptions') {
      setCurrentView('recurring');
    } else {
      setViewingCategoryId(categoryId);
    }
  };
  
  if (isAddingExpense) {
    return (
      <AddExpenseFlow 
        onClose={() => setIsAddingExpense(false)} 
        onAddNewCategory={handleOpenCreateCategoryModal}
      />
    );
  }

  return (
    <>
      {viewingCategoryId ? (
        <CategoryDetailView
          categoryId={viewingCategoryId}
          onBack={() => setViewingCategoryId(null)}
          onEditCategory={handleOpenEditCategoryModal}
        />
      ) : (
        <div className="p-4 space-y-6">
          <header className="flex justify-between items-center">
            <div className="flex items-center gap-4">
                <button onClick={() => setCurrentView('home')} className="p-2 rounded-lg hover:bg-slate-700 transition-colors" title="Go to Home">
                    <span className="text-3xl">🏠</span>
                </button>
                <h1 className="text-3xl font-bold text-white">Budget 💰</h1>
            </div>
            <div className="flex items-center gap-2">
              <UserSwitcher />
               {currentUser.role !== 'kid' && (
                <Button onClick={handleGenerateSummary} disabled={isGeneratingSummary} variant="secondary">
                  <SparklesIcon className="w-5 h-5" />
                  {isGeneratingSummary ? 'Analyzing...' : 'Get AI Summary'}
                </Button>
              )}
              <Button onClick={() => setIsAddingExpense(true)}>
                <PlusIcon className="w-5 h-5" />
                Add Expense
              </Button>
            </div>
          </header>
          
          {currentUser.role !== 'kid' && <BudgetOverview onClick={() => setBudgetManagerModalOpen(true)} />}

          <GeminiSummary summary={summary} isLoading={isGeneratingSummary} />

          {visibleGroups.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-3">Categories 🇮🇹</h2>
              <div className="space-y-4">
                {visibleGroups.map((group) => {
                  const categoriesInGroup = visibleCategories.filter(c => group.categoryIds.includes(c.id));
                  return (
                    <CategoryGroupCard 
                      key={group.id} 
                      group={group} 
                      categories={categoriesInGroup} 
                      onCategoryClick={handleSelectCategory}
                    />
                  )
                })}
              </div>
            </div>
          )}
          
          {ungroupedCategories.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-3">{visibleGroups.length > 0 ? 'Other Categories' : 'Your Categories'}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ungroupedCategories.map((category) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    onClick={() => handleSelectCategory(category.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {isCategoryModalOpen && (
        <AddCategoryModal
          isOpen={isCategoryModalOpen}
          onClose={handleCloseCategoryModal}
          categoryToEdit={categoryToEdit}
        />
      )}
      
      <EndMonthRolloverModal 
        isOpen={isBudgetManagerModalOpen}
        onClose={() => setBudgetManagerModalOpen(false)}
      />
    </>
  );
};

export default BudgetDashboard;