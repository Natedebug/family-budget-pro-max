import React from 'react';
import Card from '../ui/Card';
import ProgressBar from '../ui/ProgressBar';
import { BudgetCategory } from '../../types';

interface CategoryCardProps {
  category: BudgetCategory;
  onClick: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onClick }) => {
  const { name, icon, allocated, spent, color, gradient } = category;
  const remaining = allocated - spent;
  const isOverBudget = remaining < 0;

  const formattedAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <Card className="flex flex-col justify-between" onClick={onClick}>
      <div>
        <div className="flex items-center mb-2">
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-xl mr-3`}>
            {icon}
          </div>
          <h3 className="text-lg font-semibold text-white">{name}</h3>
        </div>
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-sm text-slate-400">Spent</span>
          <span className="font-semibold text-white">{formattedAmount(spent)}</span>
        </div>
        <ProgressBar value={spent} max={allocated} color={color} />
      </div>
      <div className="mt-3 text-right">
        <p className={`text-sm font-bold ${isOverBudget ? 'text-red-400' : 'text-green-400'}`}>
          {isOverBudget ? `${formattedAmount(Math.abs(remaining))} over` : `${formattedAmount(remaining)} left`}
        </p>
      </div>
    </Card>
  );
};

export default CategoryCard;
