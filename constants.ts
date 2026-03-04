import { FamilyMember, BudgetCategory, Transaction, Challenge, Badge, ChallengeType, ColorPalette, RecurringExpense, Bill, CategoryGroup, SavingsTransaction } from './types';

export const FAMILY_MEMBERS: FamilyMember[] = [
  { id: 'dad', name: 'Dad', avatar: '👨', points: 2450, streak: 12, badges: ['b1', 'b2', 'b3', 'b4'], role: 'admin' },
  { id: 'mom', name: 'Mom', avatar: '👩', points: 2980, streak: 15, badges: ['b1', 'b2', 'b3', 'b4', 'b5'], role: 'member' },
  { id: 'kid1', name: 'Alex', avatar: '👦', points: 1500, streak: 5, badges: ['b1', 'b2'], role: 'kid' },
  { id: 'kid2', name: 'Mia', avatar: '👧', points: 1820, streak: 8, badges: ['b1', 'b2', 'b7'], role: 'kid' },
];

export const BUDGET_CATEGORIES: BudgetCategory[] = [
  { id: 'groceries', name: 'Groceries', icon: '🛒', color: 'green-400', gradient: 'from-green-500 to-emerald-500', allocated: 800, spent: 550.75 },
  { id: 'gas', name: 'Gas', icon: '⛽', color: 'blue-400', gradient: 'from-blue-500 to-cyan-500', allocated: 200, spent: 180.50 },
  { id: 'dining', name: 'Dining Out', icon: '🍔', color: 'orange-400', gradient: 'from-orange-500 to-amber-500', allocated: 300, spent: 310.20 },
  { id: 'utilities', name: 'Utilities', icon: '💡', color: 'yellow-400', gradient: 'from-yellow-500 to-lime-500', allocated: 250, spent: 225.00 },
  { id: 'fun-dad', name: 'Dad\'s Fun Money', icon: '🎮', color: 'purple-400', gradient: 'from-purple-500 to-violet-500', allocated: 100, spent: 45.00, ownerId: 'dad' },
  { id: 'fun-mom', name: 'Mom\'s Fun Money', icon: '💅', color: 'pink-400', gradient: 'from-pink-500 to-rose-500', allocated: 100, spent: 95.50, ownerId: 'mom' },
  { id: 'fun-alex', name: 'Alex\'s Fun Money', icon: '👦', color: 'red-400', gradient: 'from-red-500 to-rose-500', allocated: 25, spent: 25.00, ownerId: 'kid1' },
  { id: 'fun-mia', name: 'Mia\'s Fun Money', icon: '👧', color: 'teal-400', gradient: 'from-teal-500 to-cyan-500', allocated: 25, spent: 5.00, ownerId: 'kid2' },
  { id: 'subscriptions', name: 'Subscriptions', icon: '📺', color: 'indigo-400', gradient: 'from-indigo-500 to-violet-500', allocated: 50, spent: 0 },
];

export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    id: 'group1',
    name: 'Weekly Essentials',
    icon: '🛒',
    categoryIds: ['groceries', 'gas', 'utilities']
  },
  {
    id: 'group2',
    name: 'Fun Money',
    icon: '🎉',
    categoryIds: ['fun-dad', 'fun-mom', 'fun-alex', 'fun-mia']
  },
];

export const TRANSACTIONS: Transaction[] = [
  { id: 't1', merchant: 'SuperMart', amount: 125.50, date: '2023-10-26', categoryId: 'groceries', familyMemberId: 'mom' },
  { id: 't2', merchant: 'Gas Station', amount: 45.20, date: '2023-10-25', categoryId: 'gas', familyMemberId: 'dad' },
  { id: 't3', merchant: 'The Burger Joint', amount: 55.80, date: '2023-10-24', categoryId: 'dining', familyMemberId: 'mom' },
  { id: 't4', merchant: 'City Power', amount: 110.00, date: '2023-10-22', categoryId: 'utilities', familyMemberId: 'dad' },
  { id: 't5', merchant: 'Book Store', amount: 25.00, date: '2023-10-21', categoryId: 'fun-mom', familyMemberId: 'mom' },
  { id: 't6', merchant: 'Toy Store', amount: 15.00, date: '2023-10-21', categoryId: 'fun-alex', familyMemberId: 'kid1' },
  { id: 't7', merchant: 'Ice Cream', amount: 5.00, date: '2023-10-23', categoryId: 'fun-mia', familyMemberId: 'kid2' },
  { id: 't8', merchant: 'Arcade', amount: 10.00, date: '2023-10-24', categoryId: 'fun-alex', familyMemberId: 'kid1' },
];

export const RECURRING_EXPENSES: RecurringExpense[] = [
    { id: 're1', merchant: 'Netflix', amount: 15.99, categoryId: 'subscriptions', familyMemberId: 'mom', frequency: 'monthly', startDate: new Date(new Date().setDate(new Date().getDate() - 40)).toISOString().split('T')[0] },
    { id: 're2', merchant: 'Gym Membership', amount: 40.00, categoryId: 'subscriptions', familyMemberId: 'dad', frequency: 'monthly', startDate: new Date(new Date().setDate(new Date().getDate() - 40)).toISOString().split('T')[0] },
    { id: 're3', merchant: 'Allowance for Alex', amount: 10.00, categoryId: 'fun-alex', familyMemberId: 'kid1', frequency: 'weekly', startDate: new Date(new Date().setDate(new Date().getDate() - 14)).toISOString().split('T')[0] },
    { id: 're4', merchant: 'Cloud Storage', amount: 9.99, categoryId: 'subscriptions', familyMemberId: 'dad', frequency: 'monthly', startDate: new Date(new Date().setDate(new Date().getDate() - 40)).toISOString().split('T')[0] },
    { id: 're5', merchant: 'Music Stream', amount: 13.97, categoryId: 'subscriptions', familyMemberId: 'mom', frequency: 'monthly', startDate: new Date(new Date().setDate(new Date().getDate() - 40)).toISOString().split('T')[0] },
];

export const BILLS: Bill[] = [
    {
        id: 'bill1',
        name: 'Mortgage',
        icon: '🏠',
        gradient: 'from-sky-500 to-indigo-500',
        lender: 'Big Bank Inc.',
        amount: 2150.78,
        dueDate: '1st of the month',
        phoneNumber: '1-800-123-4567',
        accountNumber: '123456789-MORT',
        lastPaidDate: new Date().toISOString(), // Already paid for this month for demo
    },
    {
        id: 'bill2',
        name: 'Car Payment',
        icon: '🚗',
        gradient: 'from-red-500 to-orange-500',
        lender: 'Auto Finance Co.',
        amount: 450.25,
        dueDate: '15th of the month',
        phoneNumber: '1-888-987-6543',
        accountNumber: '987654321-AUTO'
    },
    {
        id: 'bill3',
        name: 'Car Insurance',
        icon: '🛡️',
        gradient: 'from-emerald-500 to-green-500',
        lender: 'SafeGuard Insurance',
        amount: 120.50,
        dueDate: '20th of the month',
        phoneNumber: '1-877-555-1212',
        accountNumber: 'SG-123-XYZ',
        notes: 'Policy covers both vehicles. Discount applied for safe driving.'
    }
];


export const CHALLENGES: Challenge[] = [
  { id: 'c1', type: ChallengeType.DAILY, title: 'Zero Spending Day', description: 'Don\'t spend any money today!', points: 100, icon: '💸', isCompleted: false },
  { id: 'c2', type: ChallengeType.WEEKLY, title: 'No Takeout Week', description: 'Cook all your meals at home this week.', points: 500, icon: '🥡', isCompleted: false },
  { id: 'c3', type: ChallengeType.MEMBER, title: 'Savings Race!', description: 'Challenge to save $20 first.', points: 200, icon: '⚔️', isCompleted: false, challengerId: 'kid1', challengedId: 'kid2', status: 'pending' },
  { id: 'c4', type: ChallengeType.MEMBER, title: 'Grocery Budget', description: 'Who can spend less on groceries?', points: 150, icon: '⚔️', isCompleted: false, challengerId: 'dad', challengedId: 'mom', status: 'accepted' },
];

export const BADGES: Badge[] = [
  { id: 'b1', name: 'First Challenge', description: 'Completed your first challenge.', icon: '🎉' },
  { id: 'b2', name: 'Week Warrior', description: 'Completed a weekly challenge.', icon: '🛡️' },
  { id: 'b3', name: '7-Day Streak', description: 'Maintained a 7-day streak.', icon: '🔥' },
  { id: 'b4', name: 'Point Collector', description: 'Earned 1000 points.', icon: '💰' },
  { id: 'b5', name: 'Budget Master', description: 'Stayed under budget for a month.', icon: '🧠' },
  { id: 'b6', name: 'Super Saver', description: 'Saved $500.', icon: '🏦' },
  { id: 'b7', name: 'Challenger', description: 'Sent your first member challenge.', icon: '⚔️' },
  { id: 'b8', name: 'Top of the Pops', description: 'Reached #1 on the leaderboard.', icon: '👑' },
];

export const COLOR_PALETTES: ColorPalette[] = [
    { name: 'Red', color: 'red-400', gradient: 'from-red-500 to-rose-500' },
    { name: 'Orange', color: 'orange-400', gradient: 'from-orange-500 to-amber-500' },
    { name: 'Yellow', color: 'yellow-400', gradient: 'from-yellow-500 to-lime-500' },
    { name: 'Green', color: 'green-400', gradient: 'from-green-500 to-emerald-500' },
    { name: 'Teal', color: 'teal-400', gradient: 'from-teal-500 to-cyan-500' },
    { name: 'Blue', color: 'blue-400', gradient: 'from-blue-500 to-cyan-500' },
    { name: 'Indigo', color: 'indigo-400', gradient: 'from-indigo-500 to-violet-500' },
    { name: 'Purple', color: 'purple-400', gradient: 'from-purple-500 to-fuchsia-500' },
    { name: 'Pink', color: 'pink-400', gradient: 'from-pink-500 to-rose-500' },
];

export const ICON_CATEGORIES = [
  {
    name: 'Food & Drink',
    icons: ['🛒', '🍔', '🍕', '🍎', '☕️', '🥑', '🥦', '🥐', '🍿', '🍩', '🍣', '🥡'],
  },
  {
    name: 'Shopping',
    icons: ['🛍️', '🎁', '👕', '👠', '💄', '📚', '💻', '📱', '🎮', '🛋️', '🪴', '💍'],
  },
  {
    name: 'Transportation',
    icons: ['⛽', '🚗', '✈️', '🚆', '🚌', '🚲', '🚢', '🚀', '🛴', '🗺️', '🎫', '🛠️'],
  },
  {
    name: 'Home & Utilities',
    icons: ['💡', '🏠', '💧', '⚡️', '🔑', '🗑️', '🔧', '📦', '🧾', '🧼', '🧺', '🐾'],
  },
  {
    name: 'Entertainment',
    icons: ['🎬', '🎵', '🎭', '🎨', '🎤', '🎲', '🎳', '🎯', '🎻', '🏕️', '🏖️', '🎉'],
  },
  {
    name: 'Health & Wellness',
    icons: ['💊', '🏋️‍♀️', '🧘‍♂️', '🧠', '❤️', '🏥', '🚑', '🌿', '🦷', '👓', '🩺', '💪'],
  },
  {
    name: 'Personal Care',
    icons: ['💅', '💈', '🧴', '💆‍♀️', '✨', '👟', '🕶️', '👑', '⛑️', '🎒', '🌂', '🐶'],
  },
  {
    name: 'Finance',
    icons: ['💰', '💳', '🏦', '📈', '📉', '🧾', '💸', '🪙', '⚖️', '🐷', '₿', '🤑'],
  },
  {
    name: 'Work & Education',
    icons: ['💼', '🏫', '🎓', '🔬', '🖋️', '🖇️', '📈', '🧑‍🏫', '🧑‍💻', '📅', '📮', '💡'],
  },
  {
    name: 'Kids',
    icons: ['👦', '👧', '👶', '🧸', '🍭', '🍼', '🎈', '🎨', '🧩', '⚽️', '🚲', '🍦'],
  }
];

export const INITIAL_INCOME = 5000;
export const INITIAL_SAVINGS_BALANCE = 1250.25;
export const INITIAL_SAVINGS_HISTORY: SavingsTransaction[] = [
    { id: 'sh1', date: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(), description: 'Monthly Rollover', amount: 450.75, type: 'deposit' },
    { id: 'sh2', date: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(), description: 'Overage in Dining Out', amount: 10.20, type: 'withdrawal' },
];