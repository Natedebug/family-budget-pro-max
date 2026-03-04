import React, { useState } from 'react';
import ProgressBar from '../ui/ProgressBar';
import { CategoryGroup, BudgetCategory } from '../../types';
import { ChevronDownIcon } from '../ui/Icon';
import CategoryCard from './CategoryCard';

interface CategoryGroupCardProps {
  group: CategoryGroup;
  categories: BudgetCategory[];
  onCategoryClick: (categoryId: string) => void;
}

const CategoryGroupCard: React.FC<CategoryGroupCardProps> = ({ group, categories, onCategoryClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const totalAllocated = categories.reduce((sum, cat) => sum + cat.allocated, 0);
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);

  const formattedAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden transition-all duration-300">
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-700/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xl flex-shrink-0">
            {group.icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{group.name}</h3>
            <p className="text-sm text-slate-400">{formattedAmount(totalSpent)} / {formattedAmount(totalAllocated)}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 ml-2">
            <div className="w-24 hidden sm:block">
                 <ProgressBar value={totalSpent} max={totalAllocated} color="purple-400" />
            </div>
            <ChevronDownIcon className={`w-6 h-6 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
      </div>
      
      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 bg-slate-900/50 border-t border-slate-700">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onClick={() => onCategoryClick(category.id)}
                />
              ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default CategoryGroupCard;