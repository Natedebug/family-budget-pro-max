import React from 'react';
import { Transaction } from '../../types';
import { useAppContext } from '../../hooks/useAppContext';
import { CameraIcon, RepeatIcon } from '../ui/Icon';
import Card from '../ui/Card';

interface TransactionListProps {
  transactions: Transaction[];
  onTransactionClick?: (transaction: Transaction) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onTransactionClick }) => {
  const { budgetCategories } = useAppContext();

  const getCategoryIcon = (categoryId: string) => {
    return budgetCategories.find(c => c.id === categoryId)?.icon || '❓';
  };
  
  if (transactions.length === 0) {
    return <Card><p className="text-center text-slate-400">No transactions yet.</p></Card>
  }

  return (
    <div className="bg-slate-800 rounded-2xl">
      <ul className="divide-y divide-slate-700">
        {transactions.map((tx) => (
          <li 
            key={tx.id} 
            className={`flex items-center justify-between p-4 ${onTransactionClick ? 'cursor-pointer hover:bg-slate-700/50' : ''}`}
            onClick={() => onTransactionClick?.(tx)}
          >
            <div className="flex items-center">
              <span className="text-2xl mr-4">{getCategoryIcon(tx.categoryId)}</span>
              <div>
                <p className="font-semibold text-white flex items-center gap-2">
                  {tx.merchant}
                  {tx.receiptImage && (
                    <CameraIcon className="w-5 h-5 text-slate-400" />
                  )}
                  {tx.recurringExpenseId && (
                      <RepeatIcon className="w-4 h-4 text-slate-400" title="Recurring expense" />
                  )}
                </p>
                <p className="text-sm text-slate-400">{new Date(tx.date).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="text-right">
                <p className="font-bold text-lg text-red-400">-${tx.amount.toFixed(2)}</p>
                <p className="text-sm text-slate-500">🤔</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;