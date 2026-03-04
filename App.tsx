import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import BudgetDashboard from './components/budget/BudgetDashboard';
import ChallengesDashboard from './components/challenges/ChallengesDashboard';
import RecurringDashboard from './components/recurring/RecurringDashboard';
import BillsDashboard from './components/bills/BillsDashboard';
import HistoryDashboard from './components/history/HistoryDashboard';
import { useAppContext } from './hooks/useAppContext';
import SavingsDashboard from './components/savings/SavingsDashboard';
import { View } from './types';
import HomeDashboard from './components/home/HomeDashboard';
import SettingsDashboard from './components/settings/SettingsDashboard';

const AppContent: React.FC = () => {
  const { currentUser } = useAppContext();
  const [currentView, setCurrentView] = useState<View>('home');

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeDashboard setCurrentView={setCurrentView} />;
      case 'budget':
        return <BudgetDashboard setCurrentView={setCurrentView} />;
      case 'challenges':
        return <ChallengesDashboard setCurrentView={setCurrentView} />;
      case 'transactions':
        return <HistoryDashboard setCurrentView={setCurrentView} />;
      case 'recurring':
        return <RecurringDashboard setCurrentView={setCurrentView} />;
      case 'bills':
        return <BillsDashboard setCurrentView={setCurrentView} />;
      case 'savings':
        return <SavingsDashboard setCurrentView={setCurrentView} />;
      case 'settings':
        return <SettingsDashboard setCurrentView={setCurrentView} />;
      default:
        return <HomeDashboard setCurrentView={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <main className="flex-grow pb-8">
        <div className="max-w-4xl mx-auto">
          {renderView()}
        </div>
      </main>
    </div>
  );
}


const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;