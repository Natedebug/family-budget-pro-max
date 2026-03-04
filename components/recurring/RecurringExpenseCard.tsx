import React from 'react';
import Card from '../ui/Card';
import { RecurringExpense } from '../../types';
import { useAppContext } from '../../hooks/useAppContext';
import { RepeatIcon, CheckCircleIcon } from '../ui/Icon';

interface RecurringExpenseCardProps {
  expense: RecurringExpense;
  onClick: () => void;
}

// Helper to get week number
const getWeek = (d: Date): [number, number] => {
    const date = new Date(d.getTime());
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    const week1 = new Date(date.getFullYear(), 0, 4);
    const weekNumber = 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
    return [date.getFullYear(), weekNumber];
}

const RecurringExpenseCard: React.FC<RecurringExpenseCardProps> = ({ expense, onClick }) => {
    const { budgetCategories, familyMembers, markAsPaid } = useAppContext();

    const category = budgetCategories.find(c => c.id === expense.categoryId);
    const member = familyMembers.find(m => m.id === expense.familyMemberId);

    const isPaidForCurrentPeriod = (): boolean => {
        if (!expense.lastPaidDate) return false;
        const today = new Date();
        const lastPaid = new Date(expense.lastPaidDate);

        if (expense.frequency === 'monthly') {
            return today.getFullYear() === lastPaid.getFullYear() && today.getMonth() === lastPaid.getMonth();
        } else { // weekly
            const [currentYear, currentWeek] = getWeek(today);
            const [paidYear, paidWeek] = getWeek(lastPaid);
            return currentYear === paidYear && currentWeek === paidWeek;
        }
    };
    
    const isPaid = isPaidForCurrentPeriod();

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation(); // prevent card click
        if (e.target.checked) {
            markAsPaid(expense.id, 'subscription');
        }
    };

    const getNextDueDate = () => {
        const today = new Date();
        let nextDate = new Date(expense.startDate);
        
        while (nextDate <= today) {
            if (expense.frequency === 'monthly') {
                nextDate.setMonth(nextDate.getMonth() + 1);
            } else {
                nextDate.setDate(nextDate.getDate() + 7);
            }
        }
        return nextDate.toLocaleDateString();
    }
  
    return (
        <Card onClick={onClick} className={`flex items-center justify-between transition-opacity ${isPaid ? 'opacity-60' : ''}`}>
            <div className="flex items-center gap-3">
                <input
                    type="checkbox"
                    checked={isPaid}
                    onChange={handleCheckboxChange}
                    onClick={(e) => e.stopPropagation()}
                    className="w-6 h-6 rounded-md bg-slate-700 border-slate-600 text-green-500 focus:ring-green-500 shrink-0"
                    aria-label={`Mark ${expense.merchant} as paid`}
                />
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${category?.gradient || 'from-slate-500 to-slate-600'} flex items-center justify-center text-2xl`}>
                    {category?.icon || '💸'}
                </div>
                <div>
                    <h3 className={`text-lg font-bold text-white transition-all ${isPaid ? 'line-through text-slate-400' : ''}`}>{expense.merchant}</h3>
                    <p className={`text-sm text-slate-400 capitalize flex items-center gap-1 transition-all ${isPaid ? 'line-through' : ''}`}>
                        <RepeatIcon className="w-4 h-4"/>
                        {expense.frequency}
                    </p>
                </div>
            </div>
            <div className="text-right">
                {isPaid ? (
                    <div className="flex items-center gap-1 text-green-400 font-bold bg-green-500/10 px-2 py-1 rounded-full">
                        <CheckCircleIcon className="w-5 h-5" />
                        <span>Paid</span>
                    </div>
                ) : (
                    <>
                        <p className="text-xl font-bold text-red-400">
                            -${expense.amount.toFixed(2)}
                        </p>
                        <p className="text-xs text-slate-400">
                            Next: {getNextDueDate()} by {member?.avatar}
                        </p>
                    </>
                )}
            </div>
        </Card>
    );
};

export default RecurringExpenseCard;