import React, { useState } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { BudgetCategory, Transaction } from '../../types';
import Button from '../ui/Button';
import TransactionList from './TransactionList';
import TransactionDetailModal from './TransactionDetailModal';
import { ArrowLeftIcon, PencilIcon } from '../ui/Icon';

interface CategoryDetailViewProps {
  categoryId: string;
  onBack: () => void;
  onEditCategory: (category: BudgetCategory) => void;
}

const CategoryDetailView: React.FC<CategoryDetailViewProps> = ({ categoryId, onBack, onEditCategory }) => {
  const { budgetCategories, transactions, currentUser } = useAppContext();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const category = budgetCategories.find(c => c.id === categoryId);
  const categoryTransactions = transactions.filter(t => t.categoryId === categoryId);

  if (!category) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-400 font-semibold">Category not found.</p>
        <Button onClick={onBack} className="mt-4">Go Back</Button>
      </div>
    );
  }
  
  const { name, icon, allocated, spent, gradient } = category;
  const remaining = allocated - spent;
  const isOverBudget = remaining < 0;

  const formattedAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <>
      <div className="p-4 space-y-6">
        <header className="flex justify-between items-center">
            <Button onClick={onBack} variant="outline">
                <ArrowLeftIcon className="w-4 h-4" />
                Back to Budget
            </Button>
            {currentUser.role === 'admin' && (
                <Button onClick={() => onEditCategory(category)} variant="outline">
                    <PencilIcon className="w-4 h-4" />
                    Edit Category
                </Button>
            )}
        </header>

        {/* Category Summary Card */}
        <div className={`p-6 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg text-white`}>
             <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-4xl mr-4 flex-shrink-0">
                    {icon}
                </div>
                <div>
                    <h1 className="text-3xl font-bold">{name}</h1>
                    <p className="text-white/80">Category Overview</p>
                </div>
            </div>
            <div className="space-y-2">
                <div className="w-full bg-white/20 rounded-full h-2.5">
                    <div 
                        className="bg-white h-2.5 rounded-full"
                        style={{ width: `${Math.min((spent / allocated) * 100, 100)}%` }}
                    ></div>
                </div>
                <div className="flex justify-between text-white font-semibold text-sm">
                    <span>{formattedAmount(spent)} Spent</span>
                    <span>{formattedAmount(allocated)} Budgeted</span>
                </div>
                <p className={`text-right font-bold text-lg ${isOverBudget ? 'text-red-300' : 'text-green-300'}`}>
                    {isOverBudget ? `${formattedAmount(Math.abs(remaining))} over` : `${formattedAmount(remaining)} left`}
                </p>
            </div>
        </div>

        {/* Transactions List */}
        <div>
          <h2 className="text-xl font-semibold mb-3">All Transactions in {name}</h2>
          <TransactionList 
            transactions={categoryTransactions} 
            onTransactionClick={(tx) => setSelectedTransaction(tx)}
          />
        </div>
      </div>
      {selectedTransaction && (
        <TransactionDetailModal
          transaction={selectedTransaction}
          isOpen={!!selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </>
  );
};

export default CategoryDetailView;