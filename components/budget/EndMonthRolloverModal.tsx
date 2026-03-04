import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { useAppContext } from '../../hooks/useAppContext';
import Card from '../ui/Card';
import { PencilIcon } from '../ui/Icon';
import { SurplusOption } from '../../types';

interface EndMonthRolloverModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OptionButton: React.FC<{ title: string; description: string; isActive: boolean; onClick: () => void }> = ({ title, description, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
            isActive
                ? 'bg-purple-500/20 border-purple-500'
                : 'bg-slate-700/50 border-slate-700 hover:border-slate-500'
        }`}
    >
        <p className={`font-bold ${isActive ? 'text-white' : 'text-slate-200'}`}>{title}</p>
        <p className="text-sm text-slate-400">{description}</p>
    </button>
);

const EndMonthRolloverModal: React.FC<EndMonthRolloverModalProps> = ({ isOpen, onClose }) => {
  const { budgetCategories, income, updateIncome, endMonthRollover } = useAppContext();

  const [isEditingIncome, setIsEditingIncome] = useState(false);
  const [incomeValue, setIncomeValue] = useState(String(income));
  const [surplusOption, setSurplusOption] = useState<SurplusOption>('savings');

  useEffect(() => {
    if (isOpen) {
      setIncomeValue(String(income));
      setIsEditingIncome(false);
      setSurplusOption('savings');
    }
  }, [income, isOpen]);

  const totalSpent = budgetCategories.reduce((sum, cat) => sum + cat.spent, 0);
  const surplus = income - totalSpent;

  const formattedAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const handleIncomeBlur = () => {
    const newIncome = parseFloat(incomeValue);
    if (!isNaN(newIncome) && newIncome >= 0) {
      updateIncome(newIncome);
    } else {
      setIncomeValue(String(income)); // Reset if invalid
    }
    setIsEditingIncome(false);
  };

  const handleIncomeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleIncomeBlur();
    } else if (e.key === 'Escape') {
      setIncomeValue(String(income));
      setIsEditingIncome(false);
    }
  };

  const handleConfirmRollover = () => {
    endMonthRollover(surplusOption);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Monthly Budget">
      <div className="space-y-6">
        {/* Edit Income Section */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Monthly Income</label>
          <div className="relative">
            {isEditingIncome ? (
              <input
                type="number"
                value={incomeValue}
                onChange={(e) => setIncomeValue(e.target.value)}
                onBlur={handleIncomeBlur}
                onKeyDown={handleIncomeKeyDown}
                autoFocus
                className="w-full p-3 bg-slate-900 text-lg font-semibold text-green-400 rounded-lg border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
            ) : (
              <div className="flex justify-between items-center w-full p-3 bg-slate-700 rounded-lg">
                <span className="text-white font-semibold text-lg">{formattedAmount(income)}</span>
                <button 
                  onClick={() => setIsEditingIncome(true)} 
                  className="text-slate-400 hover:text-white transition-colors p-1 rounded-md hover:bg-slate-600"
                  aria-label="Edit income"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Rollover Section */}
        <div className="pt-6 border-t border-slate-700">
            <h3 className="text-lg font-semibold text-center mb-3">End of Month Rollover</h3>
            <p className="text-slate-300 text-center text-sm mb-4">
              This will reset your spending and prepare your budget for next month.
            </p>
            
            <Card className="text-left bg-slate-800">
                <div className="flex justify-between items-center py-2">
                    <span className="text-slate-400">Total Income</span>
                    <span className="font-semibold text-green-400">{formattedAmount(income)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-t border-slate-700">
                    <span className="text-slate-400">Total Spent</span>
                    <span className="font-semibold text-red-400">-{formattedAmount(totalSpent)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-t border-slate-700">
                    <span className="font-bold text-slate-200">{surplus >= 0 ? 'Surplus' : 'Deficit'}</span>
                    <span className={`font-bold text-xl ${surplus >= 0 ? 'text-white' : 'text-red-400'}`}>
                        {formattedAmount(Math.abs(surplus))}
                    </span>
                </div>
            </Card>
            
            {surplus > 0 && (
                <div className="mt-4 space-y-4">
                    <h4 className="text-md font-semibold text-slate-200">What to do with the surplus?</h4>
                    <div className="space-y-2">
                        <OptionButton
                            title="Transfer to Savings 🏦"
                            description="Move the entire surplus to your savings account."
                            isActive={surplusOption === 'savings'}
                            onClick={() => setSurplusOption('savings')}
                        />
                        <OptionButton
                            title="Roll Over to Budget 🔄"
                            description="Distribute surplus equally among next month's categories."
                            isActive={surplusOption === 'rollover'}
                            onClick={() => setSurplusOption('rollover')}
                        />
                        <OptionButton
                            title="Boost Fun Money 🎉"
                            description="Split surplus among all members' Fun Money budgets."
                            isActive={surplusOption === 'fun_money'}
                            onClick={() => setSurplusOption('fun_money')}
                        />
                    </div>
                </div>
            )}
            
            <p className="text-xs text-slate-500 text-center mt-4">
              This action cannot be undone.
            </p>

            <div className="pt-4">
              <Button onClick={handleConfirmRollover} className="w-full">
                Confirm & Rollover
              </Button>
            </div>
        </div>
      </div>
    </Modal>
  );
};

export default EndMonthRolloverModal;