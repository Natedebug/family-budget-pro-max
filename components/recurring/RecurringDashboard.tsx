import React, { useState } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import Card from '../ui/Card';
import { RecurringExpense, View } from '../../types';
import SubscriptionDetailModal from './SubscriptionDetailModal';
import SubscriptionGroupCard from './SubscriptionGroupCard';
import UserSwitcher from '../layout/UserSwitcher';

interface RecurringDashboardProps {
  setCurrentView: (view: View) => void;
}

const RecurringDashboard: React.FC<RecurringDashboardProps> = ({ setCurrentView }) => {
  const { recurringExpenses, budgetCategories } = useAppContext();
  const [selectedSubscription, setSelectedSubscription] = useState<RecurringExpense | null>(null);

  const groupedSubscriptions = recurringExpenses.reduce((acc, expense) => {
    const categoryId = expense.categoryId;
    if (!acc[categoryId]) {
      acc[categoryId] = [];
    }
    acc[categoryId].push(expense);
    return acc;
  }, {} as Record<string, RecurringExpense[]>);
  
  const categoryOrder = Object.keys(groupedSubscriptions);

  return (
    <>
      <div className="p-4 space-y-6">
        <header className="flex justify-between items-center">
            <div className="flex items-center gap-4">
                <button onClick={() => setCurrentView('home')} className="p-2 rounded-lg hover:bg-slate-700 transition-colors" title="Go to Home">
                    <span className="text-3xl">🏠</span>
                </button>
                <h1 className="text-3xl font-bold text-white">Subscriptions 🔄</h1>
            </div>
          <UserSwitcher />
        </header>
        
        <div>
          {recurringExpenses.length > 0 ? (
            <div className="space-y-4">
              {categoryOrder.map(categoryId => {
                const category = budgetCategories.find(c => c.id === categoryId);
                const expenses = groupedSubscriptions[categoryId];
                if (!category) return null;

                return (
                  <SubscriptionGroupCard
                    key={categoryId}
                    category={category}
                    expenses={expenses}
                    onExpenseClick={setSelectedSubscription}
                  />
                );
              })}
            </div>
          ) : (
            <Card>
              <p className="text-center text-slate-400">
                You have no recurring expenses set up.
              </p>
            </Card>
          )}
        </div>
      </div>
      {selectedSubscription && (
        <SubscriptionDetailModal
          subscription={selectedSubscription}
          isOpen={!!selectedSubscription}
          onClose={() => setSelectedSubscription(null)}
        />
      )}
    </>
  );
};

export default RecurringDashboard;