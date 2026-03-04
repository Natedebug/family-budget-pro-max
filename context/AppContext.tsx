import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { FamilyMember, BudgetCategory, Transaction, Challenge, Badge, NewTransaction, ColorPalette, RecurringExpense, Bill, AppContextType, CategoryGroup, SavingsTransaction, SurplusOption } from '../types';
import { FAMILY_MEMBERS, BUDGET_CATEGORIES, TRANSACTIONS, CHALLENGES, BADGES, RECURRING_EXPENSES, BILLS, CATEGORY_GROUPS, INITIAL_INCOME, INITIAL_SAVINGS_BALANCE, INITIAL_SAVINGS_HISTORY } from '../constants';

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(FAMILY_MEMBERS);
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>(BUDGET_CATEGORIES);
  const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>(CATEGORY_GROUPS);
  const [transactions, setTransactions] = useState<Transaction[]>(TRANSACTIONS);
  const [challenges, setChallenges] = useState<Challenge[]>(CHALLENGES);
  const [recurringExpenses, setRecurringExpenses] = useState<RecurringExpense[]>(RECURRING_EXPENSES);
  const [bills, setBills] = useState<Bill[]>(BILLS);
  const [currentUser, setCurrentUser] = useState<FamilyMember>(FAMILY_MEMBERS[0]);
  const [income, setIncome] = useState<number>(INITIAL_INCOME);
  const [savingsBalance, setSavingsBalance] = useState<number>(INITIAL_SAVINGS_BALANCE);
  const [savingsHistory, setSavingsHistory] = useState<SavingsTransaction[]>(INITIAL_SAVINGS_HISTORY);


  useEffect(() => {
    generateRecurringTransactions();
  }, []); // Run once on app load

  const generateRecurringTransactions = () => {
    const today = new Date();
    let newTransactions: Transaction[] = [];
    let categoriesToUpdate: { [key: string]: number } = {};

    recurringExpenses.forEach(expense => {
        let lastTransactionDate = new Date(expense.startDate);
        
        const existingTxs = transactions
            .filter(t => t.recurringExpenseId === expense.id)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        if (existingTxs.length > 0) {
            lastTransactionDate = new Date(existingTxs[0].date);
        }

        let nextDueDate = new Date(lastTransactionDate);
        
        while (true) {
            if (expense.frequency === 'monthly') {
                nextDueDate.setMonth(nextDueDate.getMonth() + 1);
            } else if (expense.frequency === 'biweekly') {
                nextDueDate.setDate(nextDueDate.getDate() + 14);
            } else { // weekly
                nextDueDate.setDate(nextDueDate.getDate() + 7);
            }

            if (nextDueDate > today) {
                break;
            }
            
            const alreadyExists = transactions.some(t => 
                t.recurringExpenseId === expense.id &&
                new Date(t.date).toISOString().split('T')[0] === nextDueDate.toISOString().split('T')[0]
            );

            if (!alreadyExists) {
                const newTx: Transaction = {
                    id: `tx-${expense.id}-${nextDueDate.getTime()}`,
                    merchant: expense.merchant,
                    amount: expense.amount,
                    date: nextDueDate.toISOString().split('T')[0],
                    categoryId: expense.categoryId,
                    familyMemberId: expense.familyMemberId,
                    recurringExpenseId: expense.id,
                };
                newTransactions.push(newTx);
                categoriesToUpdate[expense.categoryId] = (categoriesToUpdate[expense.categoryId] || 0) + expense.amount;
            }
        }
    });

    if (newTransactions.length > 0) {
        setTransactions(prev => [...newTransactions, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        setBudgetCategories(prev => 
            prev.map(cat => 
                categoriesToUpdate[cat.id]
                    ? { ...cat, spent: cat.spent + categoriesToUpdate[cat.id] }
                    : cat
            )
        );
    }
  };
  
  const completeChallenge = (challengeId: string, memberId: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge || challenge.isCompleted) return;

    setChallenges(prev => 
      prev.map(c => c.id === challengeId ? { ...c, isCompleted: true } : c)
    );

    setFamilyMembers(prev => 
      prev.map(m => {
        if (m.id === memberId) {
          const newPoints = m.points + challenge.points;
          const newStreak = m.streak + 1;
          
          let newBadges = [...m.badges];
          if(newStreak >= 7 && !newBadges.includes('b3')) {
            newBadges.push('b3');
          }
          if(newPoints >= 1000 && !newBadges.includes('b4')) {
            newBadges.push('b4');
          }

          return { ...m, points: newPoints, streak: newStreak, badges: newBadges };
        }
        return m;
      })
    );
  };

  const addTransaction = (transaction: NewTransaction) => {
    const today = new Date().toISOString().split('T')[0];
    let recurringExpenseId: string | undefined = undefined;

    if (transaction.isRecurring && transaction.frequency) {
        const newRecurringExpense: RecurringExpense = {
            id: `re-${Date.now()}`,
            merchant: transaction.merchant,
            amount: transaction.amount,
            categoryId: transaction.categoryId,
            familyMemberId: transaction.familyMemberId,
            frequency: transaction.frequency,
            startDate: today,
        };
        setRecurringExpenses(prev => [newRecurringExpense, ...prev]);
        recurringExpenseId = newRecurringExpense.id;
    }

    const newTransaction: Transaction = {
        id: `tx-${Date.now()}`,
        date: today,
        merchant: transaction.merchant,
        amount: transaction.amount,
        categoryId: transaction.categoryId,
        familyMemberId: transaction.familyMemberId,
        receiptImage: transaction.receiptImage,
        recurringExpenseId,
    };

    setTransactions(prev => [newTransaction, ...prev]);
    
    setBudgetCategories(prev => {
        const category = prev.find(cat => cat.id === newTransaction.categoryId);
        if (category) {
            const oldSpent = category.spent;
            const newSpent = oldSpent + newTransaction.amount;
            const isOverBudget = newSpent > category.allocated && oldSpent <= category.allocated;
            
            if (isOverBudget) {
                const overage = newSpent - category.allocated;
                setSavingsBalance(s => s - overage);
                const savingsTx: SavingsTransaction = {
                    id: `sh-${Date.now()}`,
                    date: today,
                    description: `Overage in ${category.name}`,
                    amount: overage,
                    type: 'withdrawal',
                };
                setSavingsHistory(sh => [savingsTx, ...sh]);
            }
        }
        return prev.map(cat => 
            cat.id === newTransaction.categoryId 
                ? { ...cat, spent: cat.spent + newTransaction.amount }
                : cat
        );
    });
  };

  const addCategory = (name: string, icon: string, colorPalette: ColorPalette, groupId?: string) => {
    const newCategory: BudgetCategory = {
        id: `custom-${name.toLowerCase().replace(/\s/g, '-')}-${Date.now()}`,
        name,
        icon,
        color: colorPalette.color,
        gradient: colorPalette.gradient,
        allocated: 0, // Users can edit this later
        spent: 0,
    };
    setBudgetCategories(prev => [...prev, newCategory]);

    if (groupId) {
        setCategoryGroups(prev => prev.map(group => {
            if (group.id === groupId) {
                return {
                    ...group,
                    categoryIds: [...group.categoryIds, newCategory.id]
                };
            }
            return group;
        }));
    }
  };
  
  const updateCategory = (categoryId: string, name: string, icon: string, colorPalette: ColorPalette, allocated?: number) => {
    setBudgetCategories(prev => prev.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          name,
          icon,
          color: colorPalette.color,
          gradient: colorPalette.gradient,
          allocated: allocated !== undefined ? allocated : cat.allocated,
        };
      }
      return cat;
    }));
  };

  const markAsPaid = (id: string, type: 'bill' | 'subscription') => {
    const today = new Date().toISOString();
    if (type === 'bill') {
        setBills(prev => prev.map(bill => bill.id === id ? { ...bill, lastPaidDate: today } : bill));
    } else {
        setRecurringExpenses(prev => prev.map(exp => exp.id === id ? { ...exp, lastPaidDate: today } : exp));
    }
  };

  const updateIncome = (newIncome: number) => {
    setIncome(newIncome);
  };

  const endMonthRollover = (surplusOption: SurplusOption) => {
    const totalSpent = budgetCategories.reduce((sum, cat) => sum + cat.spent, 0);
    const surplus = income - totalSpent;
    
    let nextMonthCategories = [...budgetCategories];
    let alertMessage = 'No surplus this month.';

    if (surplus > 0) {
        const today = new Date().toISOString();
        if (surplusOption === 'savings') {
            setSavingsBalance(prev => prev + surplus);
            const savingsTx: SavingsTransaction = {
                id: `sh-${Date.now()}`,
                date: today,
                description: 'Monthly Rollover Surplus',
                amount: surplus,
                type: 'deposit',
            };
            setSavingsHistory(prev => [savingsTx, ...prev]);
            alertMessage = `$${surplus.toFixed(2)} moved to savings.`;
        } else if (surplusOption === 'rollover') {
             if(nextMonthCategories.length > 0) {
                const amountPerCategory = surplus / nextMonthCategories.length;
                nextMonthCategories = nextMonthCategories.map(cat => ({
                    ...cat,
                    allocated: cat.allocated + amountPerCategory
                }));
            }
            alertMessage = `$${surplus.toFixed(2)} rolled over to next month's budgets.`;
        } else if (surplusOption === 'fun_money') {
            const funMoneyGroup = categoryGroups.find(g => g.name === 'Fun Money');
            if (funMoneyGroup && funMoneyGroup.categoryIds.length > 0) {
                const funCategoryIds = new Set(funMoneyGroup.categoryIds);
                const amountPerFunCategory = surplus / funMoneyGroup.categoryIds.length;
                nextMonthCategories = nextMonthCategories.map(cat => 
                    funCategoryIds.has(cat.id)
                        ? { ...cat, allocated: cat.allocated + amountPerFunCategory }
                        : cat
                );
                alertMessage = `$${surplus.toFixed(2)} added to Fun Money categories.`;
            } else {
                 // Fallback to savings if no fun money categories found
                 setSavingsBalance(prev => prev + surplus);
                 const savingsTx: SavingsTransaction = {
                    id: `sh-${Date.now()}`,
                    date: today,
                    description: 'Monthly Rollover Surplus',
                    amount: surplus,
                    type: 'deposit',
                };
                 setSavingsHistory(prev => [savingsTx, ...prev]);
                 alertMessage = `No Fun Money categories found. $${surplus.toFixed(2)} moved to savings instead.`;
            }
        }
    }
    
    // Reset for next month
    const finalCategories = nextMonthCategories.map(cat => ({ ...cat, spent: 0 }));
    setBudgetCategories(finalCategories);
    
    setBills(prev => prev.map(bill => ({ ...bill, lastPaidDate: undefined })));
    setRecurringExpenses(prev => prev.map(exp => ({ ...exp, lastPaidDate: undefined })));

    alert(`Rollover complete! ${alertMessage} Budgets have been reset.`);
  };

  const value: AppContextType = {
    familyMembers,
    budgetCategories,
    categoryGroups,
    transactions,
    challenges,
    badges: BADGES,
    recurringExpenses,
    bills,
    currentUser,
    income,
    savingsBalance,
    savingsHistory,
    setCurrentUser,
    completeChallenge,
    addTransaction,
    addCategory,
    updateCategory,
    markAsPaid,
    updateIncome,
    endMonthRollover,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};