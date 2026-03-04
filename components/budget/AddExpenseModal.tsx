import React, { useState, useRef, useMemo } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { useAppContext } from '../../hooks/useAppContext';
import { PlusIcon, CameraIcon } from '../ui/Icon';
import { GoogleGenAI } from '@google/genai';
import { Frequency } from '../../types';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddNewCategory: () => void;
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ isOpen, onClose, onAddNewCategory }) => {
  const { budgetCategories, familyMembers, addTransaction, currentUser } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [amount, setAmount] = useState('');
  const [merchant, setMerchant] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [familyMemberId, setFamilyMemberId] = useState<string>(currentUser.id);
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState<Frequency>('monthly');

  const visibleCategories = useMemo(() => {
    if (currentUser.role === 'admin') {
      return budgetCategories;
    }
    // Member can add to shared or own. Kid can only add to own.
    return budgetCategories.filter(c => !c.ownerId || c.ownerId === currentUser.id);
  }, [currentUser, budgetCategories]);

  const resetForm = () => {
    setAmount('');
    setMerchant('');
    setCategoryId(null);
    setFamilyMemberId(currentUser.id);
    setReceiptImage(null);
    setIsProcessing(false);
    setIsRecurring(false);
    setFrequency('monthly');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    if (!amount || !merchant || !categoryId || !familyMemberId) {
      alert('Please fill out all fields.');
      return;
    }
    addTransaction({
      amount: parseFloat(amount),
      merchant,
      categoryId,
      familyMemberId,
      receiptImage: receiptImage || undefined,
      isRecurring,
      frequency: isRecurring ? frequency : undefined,
    });
    handleClose();
  };
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    
    try {
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64Data = (reader.result as string).split(',')[1];
            setReceiptImage(reader.result as string);

            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const model = 'gemini-2.5-flash';
            
            const prompt = "Analyze this receipt image and extract the merchant name and the total amount. Return the data in a clean JSON format like this: {\"merchant\": \"Merchant Name\", \"total\": 123.45}. If you cannot find a value, return null for that key.";

            const imagePart = {
                inlineData: {
                  mimeType: file.type,
                  data: base64Data
                },
            };
            
            const textPart = {
                text: prompt,
            };

            const response = await ai.models.generateContent({
                model,
                contents: { parts: [imagePart, textPart] },
            });
            
            const jsonString = response.text.replace(/```json|```/g, '').trim();
            const result = JSON.parse(jsonString);

            if (result.merchant) {
                setMerchant(result.merchant);
            }
            if (result.total) {
                setAmount(result.total.toString());
            }
        };
        reader.readAsDataURL(file);
    } catch (error) {
        console.error("Error processing receipt:", error);
        alert("Sorry, we couldn't read the receipt. Please enter the details manually.");
    } finally {
        setIsProcessing(false);
    }
  };

  const commonInputClasses = "w-full p-3 bg-slate-700 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-white disabled:opacity-50";

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New Expense">
      <div className="space-y-4 relative">
        {isProcessing && (
            <div className="absolute inset-0 bg-slate-800/80 backdrop-blur-sm flex flex-col justify-center items-center z-10 rounded-lg">
                <div className="w-12 h-12 border-4 border-t-purple-500 border-slate-600 rounded-full animate-spin"></div>
                <p className="mt-4 text-white font-semibold">Scanning receipt...</p>
            </div>
        )}
        <div>
          <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
          />
          <Button onClick={() => fileInputRef.current?.click()} className="w-full bg-slate-600 hover:bg-slate-500" variant="secondary">
              <CameraIcon className="w-5 h-5"/>
              Scan Receipt
          </Button>
        </div>

        <div className="flex items-center gap-4">
            <hr className="flex-grow border-slate-600" />
            <span className="text-slate-400 text-sm">OR</span>
            <hr className="flex-grow border-slate-600" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Amount</label>
          <input 
            type="number" 
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={commonInputClasses}
            disabled={isProcessing}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Merchant</label>
          <input 
            type="text" 
            placeholder="e.g. SuperMart"
            value={merchant}
            onChange={(e) => setMerchant(e.target.value)}
            className={commonInputClasses}
            disabled={isProcessing}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Who Paid?</label>
          <select 
            value={familyMemberId} 
            onChange={(e) => setFamilyMemberId(e.target.value)}
            className={commonInputClasses}
            disabled={isProcessing || currentUser.role === 'kid'}
          >
            {familyMembers.map(member => (
              <option key={member.id} value={member.id}>{member.name}</option>
            ))}
          </select>
        </div>
        <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {visibleCategories.map(cat => (
                    <button 
                        key={cat.id} 
                        onClick={() => setCategoryId(cat.id)}
                        disabled={isProcessing}
                        className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all text-center aspect-square disabled:opacity-50 ${categoryId === cat.id ? 'bg-purple-600 ring-2 ring-purple-400' : 'bg-slate-700 hover:bg-slate-600'}`}
                    >
                        <span className="text-2xl">{cat.icon}</span>
                        <span className="text-xs font-semibold mt-1 truncate">{cat.name}</span>
                    </button>
                ))}
                {currentUser.role === 'admin' && (
                  <button 
                      onClick={onAddNewCategory}
                      disabled={isProcessing}
                      className="flex flex-col items-center justify-center p-2 rounded-lg transition-all text-center aspect-square bg-slate-700 hover:bg-slate-600 text-slate-300 disabled:opacity-50"
                  >
                      <PlusIcon className="w-8 h-8"/>
                      <span className="text-xs font-semibold mt-1">Add New</span>
                  </button>
                )}
            </div>
        </div>
        
        <div className="pt-2 space-y-3">
            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="isRecurring"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-500 bg-slate-700 text-purple-600 focus:ring-purple-600"
                />
                <label htmlFor="isRecurring" className="ml-2 block text-sm text-slate-300">
                    Mark as recurring
                </label>
            </div>
            {isRecurring && (
                <div>
                    <label htmlFor="frequency" className="block text-sm font-medium text-slate-300 mb-1">Frequency</label>
                    <select
                        id="frequency"
                        value={frequency}
                        onChange={(e) => setFrequency(e.target.value as Frequency)}
                        className={commonInputClasses}
                    >
                        <option value="weekly">Weekly</option>
                        <option value="biweekly">Bi-weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                </div>
            )}
        </div>

        <div className="pt-4">
            <Button onClick={handleSubmit} className="w-full" disabled={isProcessing}>
                Add Expense
            </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddExpenseModal;