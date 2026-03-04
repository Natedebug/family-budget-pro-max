import React from 'react';
import Card from '../ui/Card';
import { Bill } from '../../types';
import { useAppContext } from '../../hooks/useAppContext';
import { CheckCircleIcon } from '../ui/Icon';

interface BillCardProps {
  bill: Bill;
  onClick: () => void;
}

const BillCard: React.FC<BillCardProps> = ({ bill, onClick }) => {
  const { markAsPaid } = useAppContext();

  const isPaidForCurrentMonth = (): boolean => {
    if (!bill.lastPaidDate) return false;
    const today = new Date();
    const lastPaid = new Date(bill.lastPaidDate);
    return today.getFullYear() === lastPaid.getFullYear() && today.getMonth() === lastPaid.getMonth();
  };

  const isPaid = isPaidForCurrentMonth();

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation(); // prevent card click when toggling
    if (e.target.checked) {
      markAsPaid(bill.id, 'bill');
    }
  };

  return (
    <Card 
        onClick={onClick} 
        className={`flex items-center justify-between transition-opacity ${isPaid ? 'opacity-60' : ''}`}
    >
      <div className="flex items-center gap-3">
        <input
            type="checkbox"
            checked={isPaid}
            onChange={handleCheckboxChange}
            onClick={(e) => e.stopPropagation()}
            className="w-6 h-6 rounded-md bg-slate-700 border-slate-600 text-green-500 focus:ring-green-500 shrink-0"
            aria-label={`Mark ${bill.name} as paid`}
        />
        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${bill.gradient} flex items-center justify-center text-2xl`}>
          {bill.icon}
        </div>
        <div>
          <h3 className={`text-lg font-bold text-white transition-all ${isPaid ? 'line-through text-slate-400' : ''}`}>{bill.name}</h3>
          <p className={`text-sm text-slate-400 transition-all ${isPaid ? 'line-through' : ''}`}>{bill.lender}</p>
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
                    -${bill.amount.toFixed(2)}
                </p>
                <p className="text-xs text-slate-400">
                    Due: {bill.dueDate}
                </p>
            </>
        )}
      </div>
    </Card>
  );
};

export default BillCard;