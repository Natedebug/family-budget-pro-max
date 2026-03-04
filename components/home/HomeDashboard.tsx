import React from 'react';
import { View } from '../../types';
import { useAppContext } from '../../hooks/useAppContext';
import Card from '../ui/Card';
import { 
  ClockIcon, 
  ListBulletIcon, 
  CreditCardIcon, 
  BuildingLibraryIcon, 
  BanknotesIcon, 
  CogIcon,
  ChatBubbleIcon
} from '../ui/Icon';
import UserSwitcher from '../layout/UserSwitcher';

interface HomeDashboardProps {
  setCurrentView: (view: View) => void;
}

const HomeDashboard: React.FC<HomeDashboardProps> = ({ setCurrentView }) => {
  const { currentUser } = useAppContext();

  const navigationItems = [
    { name: 'budget' as View, label: 'Budget', description: 'View and manage your budget categories.', icon: '💰', roles: ['admin', 'member', 'kid'] },
    { name: 'transactions' as View, label: 'History', description: 'See all past transactions.', icon: <ListBulletIcon />, roles: ['admin', 'member'] },
    { name: 'bills' as View, label: 'Bills', description: 'Track and pay major bills.', icon: <BuildingLibraryIcon />, roles: ['admin'] },
    { name: 'settings' as View, label: 'Settings', description: 'Configure app and user settings.', icon: <CogIcon />, roles: ['admin', 'member'] },
    { name: 'challenges' as View, label: 'Challenges', description: 'Compete in family challenges and earn points.', icon: <ClockIcon />, roles: ['admin', 'member', 'kid'] },
    { name: 'recurring' as View, label: 'Subscriptions', description: 'Manage recurring payments.', icon: <CreditCardIcon />, roles: ['admin'] },
    { name: 'savings' as View, label: 'Savings', description: 'Watch your family savings grow.', icon: <BanknotesIcon />, roles: ['admin'] },
    { name: 'chat' as View, label: 'AI Chat', description: 'Ask your AI assistant anything about your finances.', icon: <ChatBubbleIcon />, roles: ['admin', 'member'] },
  ];

  const visibleItems = navigationItems.filter(item => item.roles.includes(currentUser.role));

  return (
    <div className="p-4 space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Welcome, {currentUser.name}!</h1>
          <p className="text-slate-400">Here's your family finance dashboard.</p>
        </div>
        <UserSwitcher />
      </header>

      <div className="grid grid-cols-1 gap-4">
        {visibleItems.map(item => (
          <Card key={item.name} onClick={() => setCurrentView(item.name)} className="flex items-center">
            <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center text-2xl mr-4 flex-shrink-0">
              {item.icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{item.label}</h3>
              <p className="text-slate-400 text-sm mt-1">{item.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HomeDashboard;