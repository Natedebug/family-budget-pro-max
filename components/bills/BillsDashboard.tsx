import React, { useState } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import BillCard from './BillCard';
import BillDetailModal from './BillDetailModal';
import { Bill, View } from '../../types';
import UserSwitcher from '../layout/UserSwitcher';

interface BillsDashboardProps {
  setCurrentView: (view: View) => void;
}

const BillsDashboard: React.FC<BillsDashboardProps> = ({ setCurrentView }) => {
  const { bills } = useAppContext();
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);

  const handleBillClick = (bill: Bill) => {
    setSelectedBill(bill);
  };

  const handleCloseModal = () => {
    setSelectedBill(null);
  };

  return (
    <>
      <div className="p-4 space-y-6">
        <header className="flex justify-between items-center">
            <div className="flex items-center gap-4">
                <button onClick={() => setCurrentView('home')} className="p-2 rounded-lg hover:bg-slate-700 transition-colors" title="Go to Home">
                    <span className="text-3xl">🏠</span>
                </button>
                <h1 className="text-3xl font-bold text-white">Major Bills 🏛️</h1>
            </div>
          <UserSwitcher />
        </header>
        
        <div className="space-y-4">
          {bills.map(bill => (
            <BillCard key={bill.id} bill={bill} onClick={() => handleBillClick(bill)} />
          ))}
        </div>
      </div>

      {selectedBill && (
        <BillDetailModal 
          bill={selectedBill} 
          isOpen={!!selectedBill} 
          onClose={handleCloseModal} 
        />
      )}
    </>
  );
};

export default BillsDashboard;