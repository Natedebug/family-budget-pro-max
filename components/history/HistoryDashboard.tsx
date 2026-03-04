import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import TransactionList from '../budget/TransactionList';
import { Transaction, View } from '../../types';
import TransactionDetailModal from '../budget/TransactionDetailModal';
import UserSwitcher from '../layout/UserSwitcher';

interface HistoryDashboardProps {
  setCurrentView: (view: View) => void;
}

const HistoryDashboard: React.FC<HistoryDashboardProps> = ({ setCurrentView }) => {
  const { transactions, currentUser, budgetCategories } = useAppContext();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const visibleTransactions = useMemo(() => {
    if (currentUser.role === 'admin') {
        return transactions;
    }
    
    const visibleCategoryIds = new Set(
        budgetCategories
            .filter(c => !c.ownerId || c.ownerId === currentUser.id)
            .map(c => c.id)
    );

    return transactions.filter(t => visibleCategoryIds.has(t.categoryId));
  }, [transactions, currentUser, budgetCategories]);

  return (
    <>
        <div className="p-4 space-y-6">
            <header className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button onClick={() => setCurrentView('home')} className="p-2 rounded-lg hover:bg-slate-700 transition-colors" title="Go to Home">
                        <span className="text-3xl">🏠</span>
                    </button>
                    <h1 className="text-3xl font-bold text-white">Transaction History 📜</h1>
                </div>
              <UserSwitcher />
            </header>
            
            <div>
                <TransactionList 
                    transactions={visibleTransactions} 
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

export default HistoryDashboard;