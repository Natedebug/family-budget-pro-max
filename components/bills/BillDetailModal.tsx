import React from 'react';
import Modal from '../ui/Modal';
import { Bill } from '../../types';

interface BillDetailModalProps {
  bill: Bill;
  isOpen: boolean;
  onClose: () => void;
}

const BillDetailModal: React.FC<BillDetailModalProps> = ({ bill, isOpen, onClose }) => {

  const DetailRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
      <dt className="text-sm font-medium text-slate-400">{label}</dt>
      <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">{value}</dd>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${bill.name} Details`}>
      <div className="flow-root">
        <dl className="-my-3 divide-y divide-slate-700">
          <DetailRow label="Lender" value={bill.lender} />
          <DetailRow label="Amount" value={
            <span className="font-semibold text-red-400">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(bill.amount)}
            </span>
          } />
          <DetailRow label="Due Date" value={bill.dueDate} />
          <DetailRow label="Phone Number" value={
            <a href={`tel:${bill.phoneNumber}`} className="text-purple-400 hover:underline">
              {bill.phoneNumber}
            </a>
          } />
          <DetailRow label="Account #" value={bill.accountNumber} />
          {bill.notes && (
            <DetailRow label="Notes" value={<p className="whitespace-pre-wrap">{bill.notes}</p>} />
          )}
        </dl>
      </div>
    </Modal>
  );
};

export default BillDetailModal;
