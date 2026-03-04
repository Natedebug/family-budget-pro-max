import React, { useState } from 'react';
import Card from '../ui/Card';
import { BudgetCategory, RecurringExpense } from '../../types';
import { ChevronDownIcon } from '../ui/Icon';
import RecurringExpenseCard from './RecurringExpenseCard';

interface SubscriptionGroupCardProps {
  category: BudgetCategory;
  expenses: RecurringExpense[];
  onExpenseClick: (expense: RecurringExpense) => void;
}

const SubscriptionGroupCard: React.FC<SubscriptionGroupCardProps> = ({ category, expenses, onExpenseClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const totalMonthlyCost = expenses.reduce((sum, expense) => {
    // A more complex calculation would be needed for weekly vs monthly
    return sum + (expense.frequency === 'weekly' ? expense.amount * 4.33 : expense.amount);
  }, 0);

  const formattedAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <Card className="p-0 overflow-hidden">
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-700/50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${category.gradient} flex items-center justify-center text-xl mr-3`}>
            {category.icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{category.name}</h3>
            <p className="text-sm text-slate-400">{expenses.length} subscription{expenses.length > 1 ? 's' : ''}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
            <p className="font-bold text-red-400">{formattedAmount(totalMonthlyCost)}<span className="text-xs text-slate-400 font-normal">/mo</span></p>
            <ChevronDownIcon className={`w-6 h-6 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
      </div>
      
      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 bg-slate-900/50 border-t border-slate-700 space-y-3">
            {expenses.map((expense) => (
                <RecurringExpenseCard
                  key={expense.id}
                  expense={expense}
                  onClick={() => onExpenseClick(expense)}
                />
            ))}
        </div>
      )}
    </Card>
  );
};

export default SubscriptionGroupCard;