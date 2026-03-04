import React, { useState, useRef, useMemo } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import Button from '../ui/Button';
import { PlusIcon, CameraIcon, ArrowLeftIcon } from '../ui/Icon';
import { GoogleGenAI } from '@google/genai';
import { Frequency } from '../../types';
import Card from '../ui/Card';

interface AddExpenseFlowProps {
  onClose: () => void;
  onAddNewCategory: () => void;
}

const AddExpenseFlow: React.FC<AddExpenseFlowProps> = ({ onClose, onAddNewCategory }) => {
    const { budgetCategories, familyMembers, addTransaction, currentUser } = useAppContext();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [step, setStep] = useState<'selection' | 'single' | 'recurring'>('selection');

    // Form state
    const [amount, setAmount] = useState('');
    const [merchant, setMerchant] = useState('');
    const [categoryId, setCategoryId] = useState<string | null>(null);
    const [familyMemberId, setFamilyMemberId] = useState<string>(currentUser.id);
    const [receiptImage, setReceiptImage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [frequency, setFrequency] = useState<Frequency>('monthly');
    
    const visibleCategories = useMemo(() => {
        if (currentUser.role === 'admin') {
            return budgetCategories;
        }
        return budgetCategories.filter(c => !c.ownerId || c.ownerId === currentUser.id);
    }, [currentUser, budgetCategories]);

    const resetForm = () => {
        setAmount('');
        setMerchant('');
        setCategoryId(null);
        setFamilyMemberId(currentUser.id);
        setReceiptImage(null);
        setIsProcessing(false);
        setFrequency('monthly');
    };

    const handleBackToSelection = () => {
        resetForm();
        setStep('selection');
    };

    const handleSelectStep = (selectedStep: 'single' | 'recurring') => {
        resetForm();
        setStep(selectedStep);
    }

    const handleSubmit = () => {
        const isRecurringForm = step === 'recurring';
        if (!amount || !merchant || !categoryId || !familyMemberId) {
            alert('Please fill out all required fields.');
            return;
        }
        addTransaction({
            amount: parseFloat(amount),
            merchant,
            categoryId,
            familyMemberId,
            receiptImage: receiptImage || undefined,
            isRecurring: isRecurringForm,
            frequency: isRecurringForm ? frequency : undefined,
        });
        onClose(); // Close the whole flow on success
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
                    model: 'gemini-2.5-flash',
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

    const renderForm = () => {
        const isRecurringForm = step === 'recurring';
        return (
            <div className="space-y-4 relative">
                {isProcessing && (
                    <div className="absolute inset-0 bg-slate-800/80 backdrop-blur-sm flex flex-col justify-center items-center z-10 rounded-lg">
                        <div className="w-12 h-12 border-4 border-t-purple-500 border-slate-600 rounded-full animate-spin"></div>
                        <p className="mt-4 text-white font-semibold">Scanning receipt...</p>
                    </div>
                )}

                {!isRecurringForm && (
                    <>
                        <div>
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                            <Button onClick={() => fileInputRef.current?.click()} className="w-full bg-slate-600 hover:bg-slate-500" variant="secondary">
                                <CameraIcon className="w-5 h-5"/> Scan Receipt
                            </Button>
                        </div>
                        <div className="flex items-center gap-4">
                            <hr className="flex-grow border-slate-600" />
                            <span className="text-slate-400 text-sm">OR</span>
                            <hr className="flex-grow border-slate-600" />
                        </div>
                    </>
                )}

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">{isRecurringForm ? 'Name' : 'Merchant'}</label>
                    <input 
                        type="text" 
                        placeholder={isRecurringForm ? "e.g. Weekly Gas Budget" : "e.g. SuperMart"}
                        value={merchant}
                        onChange={(e) => setMerchant(e.target.value)}
                        className={commonInputClasses}
                        disabled={isProcessing}
                    />
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
            
                {isRecurringForm && (
                    <div>
                        <label htmlFor="frequency" className="block text-sm font-medium text-slate-300 mb-1">How often?</label>
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
            
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Paid By</label>
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

                <div className="pt-4">
                    <Button onClick={handleSubmit} className="w-full" disabled={isProcessing}>
                        {isRecurringForm ? 'Add Recurring Expense' : 'Add Expense'}
                    </Button>
                </div>
            </div>
        );
    }
    
    const renderContent = () => {
        switch(step) {
            case 'selection':
                return (
                    <div className="space-y-4">
                        <Card onClick={() => handleSelectStep('single')} className="text-center p-6">
                             <h3 className="text-2xl font-bold">🛒 Single Expense</h3>
                             <p className="text-slate-400 mt-2">For one-time purchases like groceries, dining out, or a new toy.</p>
                        </Card>
                        <Card onClick={() => handleSelectStep('recurring')} className="text-center p-6">
                            <h3 className="text-2xl font-bold">🔄 Recurring Expense</h3>
                            <p className="text-slate-400 mt-2">For regular payments like subscriptions, allowances, or weekly budgets.</p>
                        </Card>
                    </div>
                );
            case 'single':
            case 'recurring':
                return renderForm();
        }
    };

    const getTitle = () => {
        switch(step) {
            case 'selection': return "Add an Expense";
            case 'single': return "Add Single Expense";
            case 'recurring': return "Add Recurring Expense";
        }
    }

    return (
         <div className="p-4 space-y-6">
            <header className="flex items-center">
                 <button onClick={step === 'selection' ? onClose : handleBackToSelection} className="p-2 -ml-2 mr-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-bold text-white">{getTitle()}</h1>
            </header>
            <main>
                {renderContent()}
            </main>
        </div>
    );
};

export default AddExpenseFlow;