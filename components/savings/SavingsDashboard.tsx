import React from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import Card from '../ui/Card';
import { SavingsTransaction, View } from '../../types';
import UserSwitcher from '../layout/UserSwitcher';

interface SavingsDashboardProps {
  setCurrentView: (view: View) => void;
}

const SavingsDashboard: React.FC<SavingsDashboardProps> = ({ setCurrentView }) => {
  const { savingsBalance, savingsHistory } = useAppContext();

  const formattedAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <div className="p-4 space-y-6">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-4">
            <button onClick={() => setCurrentView('home')} className="p-2 rounded-lg hover:bg-slate-700 transition-colors" title="Go to Home">
                <span className="text-3xl">🏠</span>
            </button>
            <h1 className="text-3xl font-bold text-white">Savings 🏦</h1>
        </div>
        <UserSwitcher />
      </header>
      
      <Card className="text-center bg-gradient-to-br from-emerald-500 to-green-600">
        <p className="text-sm font-medium text-green-200">Current Savings Balance</p>
        <p className="text-5xl font-extrabold text-white mt-2">
          {formattedAmount(savingsBalance)}
        </p>
      </Card>

      <div>
        <h2 className="text-xl font-semibold mb-3">Savings History</h2>
        {savingsHistory.length > 0 ? (
          <div className="bg-slate-800 rounded-2xl">
            <ul className="divide-y divide-slate-700">
              {savingsHistory.map((tx: SavingsTransaction) => {
                const isDeposit = tx.type === 'deposit';
                return (
                  <li key={tx.id} className="flex items-center justify-between p-4">
                    <div className="flex items-center">
                      <span className="text-2xl mr-4">{isDeposit ? '🟢' : '🔴'}</span>
                      <div>
                        <p className="font-semibold text-white">{tx.description}</p>
                        <p className="text-sm text-slate-400">{new Date(tx.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className={`font-bold text-lg ${isDeposit ? 'text-green-400' : 'text-red-400'}`}>
                      {isDeposit ? '+' : '-'}{formattedAmount(tx.amount)}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <Card>
            <p className="text-center text-slate-400">No savings activity yet.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SavingsDashboard;