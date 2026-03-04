import React from 'react';
import { View } from '../../types';
import UserSwitcher from '../layout/UserSwitcher';

interface SettingsDashboardProps {
  setCurrentView: (view: View) => void;
}

const SettingsDashboard: React.FC<SettingsDashboardProps> = ({ setCurrentView }) => {
  return (
    <div className="p-4 space-y-6">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-4">
            <button onClick={() => setCurrentView('home')} className="p-2 rounded-lg hover:bg-slate-700 transition-colors" title="Go to Home">
                <span className="text-3xl">🏠</span>
            </button>
            <h1 className="text-3xl font-bold text-white">Settings ⚙️</h1>
        </div>
        <UserSwitcher />
      </header>
      <div className="text-center mt-10">
        <p className="text-slate-400 text-lg">Settings are coming soon!</p>
      </div>
    </div>
  );
};

export default SettingsDashboard;