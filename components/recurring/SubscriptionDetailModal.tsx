import React from 'react';
import Modal from '../ui/Modal';
import { RecurringExpense } from '../../types';
import { useAppContext } from '../../hooks/useAppContext';

interface SubscriptionDetailModalProps {
  subscription: RecurringExpense;
  isOpen: boolean;
  onClose: () => void;
}

const SubscriptionDetailModal: React.FC<SubscriptionDetailModalProps> = ({ subscription, isOpen, onClose }) => {
    const { budgetCategories, familyMembers, transactions } = useAppContext();

    const category = budgetCategories.find(c => c.id === subscription.categoryId);
    const member = familyMembers.find(m => m.id === subscription.familyMemberId);

    const currentYear = new Date().getFullYear();
    const ytdTotal = transactions
        .filter(tx => 
            tx.recurringExpenseId === subscription.id &&
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
        <Modal isOpen={isOpen} onClose={onClose} title="Subscription Details">
            <div className="flow-root">
                <dl className="-my-3 divide-y divide-slate-700">
                    <DetailRow label="Merchant" value={subscription.merchant} />
                    <DetailRow label="Amount" value={
                        <span className="font-semibold text-red-400">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(subscription.amount)}
                        </span>
                    } />
                    <DetailRow label="Frequency" value={<span className="capitalize">{subscription.frequency}</span>} />
                     <DetailRow label="Category" value={
                        <span className="flex items-center">{category?.icon} <span className="ml-2">{category?.name}</span></span>
                    } />
                    <DetailRow label="YTD Total" value={
                        <span className="font-semibold">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(ytdTotal)}
                        </span>
                    } />
                    <DetailRow label="Paid By" value={
                        <span className="flex items-center">{member?.avatar} <span className="ml-2">{member?.name}</span></span>
                    } />
                    <DetailRow label="Started On" value={new Date(subscription.startDate).toLocaleDateString()} />
                </dl>
            </div>
        </Modal>
    );
};

export default SubscriptionDetailModal;
