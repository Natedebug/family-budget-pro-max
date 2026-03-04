export interface FamilyMember {
  id: string;
  name: string;
  avatar: string;
  points: number;
  streak: number;
  badges: Badge['id'][];
  role: 'admin' | 'member' | 'kid';
}

export interface BudgetCategory {
  id:string;
  name: string;
  icon: string;
  color: string;
  gradient: string;
  allocated: number;
  spent: number;
  ownerId?: string;
}

export interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  date: string;
  categoryId: string;
  familyMemberId: string;
  receiptImage?: string;
  recurringExpenseId?: string;
}

export enum ChallengeType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MEMBER = 'member',
}

export interface Challenge {
  id: string;
  type: ChallengeType;
  title: string;
  description: string;
  points: number;
  icon: string;
  isCompleted: boolean;
  // For member challenges
  challengerId?: string;
  challengedId?: string;
  status?: 'pending' | 'accepted' | 'declined';
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export type Frequency = 'weekly' | 'biweekly' | 'monthly';

export interface RecurringExpense {
    id: string;
    merchant: string;
    amount: number;
    categoryId: string;
    familyMemberId: string;
    frequency: Frequency;
    startDate: string; // ISO date string
    lastPaidDate?: string;
}

export interface NewTransaction {
    merchant: string;
    amount: number;
    categoryId: string;
    familyMemberId: string;
    receiptImage?: string;
    isRecurring?: boolean;
    frequency?: Frequency;
}

export interface ColorPalette {
    name: string;
    color: string;
    gradient: string;
}

export interface Bill {
  id: string;
  name: string;
  icon: string;
  gradient: string;
  lender: string;
  amount: number;
  dueDate: string; // e.g., "1st of the month"
  phoneNumber: string;
  accountNumber: string;
  notes?: string;
  lastPaidDate?: string;
}

export interface CategoryGroup {
  id: string;
  name: string;
  icon: string;
  categoryIds: string[];
}

export interface SavingsTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'deposit' | 'withdrawal';
}

export type SurplusOption = 'savings' | 'rollover' | 'fun_money';

export interface AppContextType {
  familyMembers: FamilyMember[];
  budgetCategories: BudgetCategory[];
  categoryGroups: CategoryGroup[];
  transactions: Transaction[];
  challenges: Challenge[];
  badges: Badge[];
  recurringExpenses: RecurringExpense[];
  bills: Bill[];
  currentUser: FamilyMember;
  income: number;
  savingsBalance: number;
  savingsHistory: SavingsTransaction[];
  setCurrentUser: (member: FamilyMember) => void;
  completeChallenge: (challengeId: string, memberId: string) => void;
  addTransaction: (transaction: NewTransaction) => void;
  addCategory: (name: string, icon: string, colorPalette: ColorPalette, groupId?: string) => void;
  updateCategory: (categoryId: string, name: string, icon: string, colorPalette: ColorPalette, allocated?: number) => void;
  markAsPaid: (id: string, type: 'bill' | 'subscription') => void;
  updateIncome: (newIncome: number) => void;
  endMonthRollover: (surplusOption: SurplusOption) => void;
}

export type View = 'home' | 'budget' | 'challenges' | 'transactions' | 'recurring' | 'bills' | 'savings' | 'settings';