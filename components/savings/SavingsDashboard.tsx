import React, { useState } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import Card from '../ui/Card';
import { SavingsTransaction, View } from '../../types';
import UserSwitcher from '../layout/UserSwitcher';
import Button from '../ui/Button';
import { SparklesIcon } from '../ui/Icon';
import { coachSavings } from '../../services/agents/savingsCoachAgent';

interface SavingsDashboardProps {
  setCurrentView: (view: View) => void;
}

const SavingsDashboard: React.FC<SavingsDashboardProps> = ({ setCurrentView }) => {
  const { savingsBalance, savingsHistory, income, budgetCategories } = useAppContext();
  const [coaching, setCoaching] = useState<string | null>(null);
  const [isCoaching, setIsCoaching] = useState(false);

  const formattedAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const handleGetCoaching = async () => {
    setIsCoaching(true);
    setCoaching(null);
    try {
      const result = await coachSavings({ savingsBalance, income, categories: budgetCategories });
      setCoaching(result);
    } catch (err) {
      console.error('Savings coaching error:', err);
      setCoaching('Unable to generate coaching at this time. Please try again.');
    } finally {
      setIsCoaching(false);
    }
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

      <div className="flex justify-end">
        <Button onClick={handleGetCoaching} disabled={isCoaching} variant="secondary">
          <SparklesIcon className="w-5 h-5" />
          {isCoaching ? 'Analyzing...' : 'Get AI Coaching'}
        </Button>
      </div>

      {(coaching || isCoaching) && (
        <Card className="bg-slate-800/60 border border-slate-700">
          <div className="flex items-center mb-3">
            <SparklesIcon className="w-5 h-5 text-purple-400 mr-2" />
            <h3 className="text-lg font-semibold text-white">Savings Coach</h3>
          </div>
          {isCoaching ? (
            <div className="flex flex-col items-center py-4">
              <div className="w-8 h-8 border-4 border-t-purple-500 border-slate-600 rounded-full animate-spin mb-3" />
              <p className="text-slate-400">Analyzing your savings...</p>
            </div>
          ) : (
            <p className="text-slate-300 text-sm whitespace-pre-wrap">{coaching}</p>
          )}
        </Card>
      )}

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