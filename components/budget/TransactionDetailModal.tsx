import React from 'react';
import Modal from '../ui/Modal';
import { Transaction } from '../../types';
import { useAppContext } from '../../hooks/useAppContext';

interface TransactionDetailModalProps {
  transaction: Transaction;
  isOpen: boolean;
  onClose: () => void;
}

const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({ transaction, isOpen, onClose }) => {
  const { budgetCategories, familyMembers, transactions: allTransactions } = useAppContext();
  
  const category = budgetCategories.find(c => c.id === transaction.categoryId);
  const member = familyMembers.find(m => m.id === transaction.familyMemberId);

  const currentYear = new Date().getFullYear();
  const ytdTotal = allTransactions
    .filter(tx => 
      tx.categoryId === transaction.categoryId && 
      new Date(tx.date).getFullYear() === currentYear
    )
    .reduce((sum, tx) => sum + tx.amount, 0);

  const DetailRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
      <dt className="text-sm font-medium text-slate-400">{label}</dt>
      <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">{value}</dd>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Transaction Details">
      <div className="flow-root">
        <dl className="-my-3 divide-y divide-slate-700">
          <DetailRow label="Merchant" value={transaction.merchant} />
          <DetailRow label="Amount" value={
            <span className="font-semibold text-red-400">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(transaction.amount)}
            </span>
          } />
          <DetailRow label="Date" value={new Date(transaction.date).toLocaleDateString()} />
          <DetailRow label="Category" value={
            <span className="flex items-center">{category?.icon} <span className="ml-2">{category?.name}</span></span>
          } />
           <DetailRow label="YTD in Category" value={
            <span className="font-semibold">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(ytdTotal)}
            </span>
          } />
          <DetailRow label="Paid By" value={
             <span className="flex items-center">{member?.avatar} <span className="ml-2">{member?.name}</span></span>
          } />
        </dl>
        {transaction.receiptImage && (
            <div className="mt-6">
                <h3 className="text-lg font-medium text-white mb-2">Receipt</h3>
                <img src={transaction.receiptImage} alt={`Receipt for ${transaction.merchant}`} className="rounded-lg w-full" />
            </div>
        )}
      </div>
    </Modal>
  );
};

export default TransactionDetailModal;
