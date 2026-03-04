import React, { useMemo } from 'react';
import Card from '../ui/Card';
import { useAppContext } from '../../hooks/useAppContext';

interface BudgetOverviewProps {
  onClick: () => void;
}

const BudgetOverview: React.FC<BudgetOverviewProps> = ({ onClick }) => {
  const { budgetCategories, income, currentUser } = useAppContext();

  const visibleCategories = useMemo(() => {
    if (currentUser.role === 'admin') {
      return budgetCategories;
    }
    // Member sees shared categories + their own.
    return budgetCategories.filter(c => !c.ownerId || c.ownerId === currentUser.id);
  }, [currentUser, budgetCategories]);

  if (currentUser.role === 'kid') {
    return null;
  }

  const totalBudgeted = visibleCategories.reduce((sum, cat) => sum + cat.allocated, 0);
  const totalSpent = visibleCategories.reduce((sum, cat) => sum + cat.spent, 0);
  const remaining = income - totalSpent;

  const formattedAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };
  
  return (
    <Card 
      className="bg-slate-800/60 backdrop-blur-sm border border-slate-700"
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <h2 className="text-lg font-semibold mb-4 text-slate-300">Monthly Overview</h2>
      </div>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-sm text-slate-400">Income</p>
          <p className="text-2xl font-bold text-green-400">
            {formattedAmount(income)}
          </p>
        </div>
        <div>
          <p className="text-sm text-slate-400">Budgeted</p>
          <p className="text-2xl font-bold text-blue-400">{formattedAmount(totalBudgeted)}</p>
        </div>
        <div>
          <p className="text-sm text-slate-400">Remaining</p>
          <p className={`text-2xl font-bold ${remaining >= 0 ? 'text-white' : 'text-red-400'}`}>{formattedAmount(remaining)}</p>
        </div>
      </div>
    </Card>
  );
};

export default BudgetOverview;