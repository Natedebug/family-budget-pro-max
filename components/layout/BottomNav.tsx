
import React from 'react';

interface NavItem {
  name: string;
  label: string;
  icon: React.ReactNode;
}

interface BottomNavProps {
  items: NavItem[];
  currentView: string;
  setCurrentView: (view: any) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ items, currentView, setCurrentView }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-slate-800/80 backdrop-blur-sm border-t border-slate-700 z-50">
      <div className="max-w-4xl mx-auto h-full">
        <div className="flex justify-around items-center h-full">
          {items.map((item) => {
            const isActive = currentView === item.name;
            return (
              <button
                key={item.name}
                onClick={() => setCurrentView(item.name)}
                className="flex flex-col items-center justify-center space-y-1 w-full transition-colors duration-300 group"
              >
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center
                  transition-all duration-300
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg' 
                    : 'bg-slate-700 group-hover:bg-slate-600'
                  }`}
                >
                  <div className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}>
                    {item.icon}
                  </div>
                </div>
                <span className={`text-xs font-medium transition-colors duration-300 ${
                  isActive ? 'text-purple-400' : 'text-slate-400 group-hover:text-white'
                }`}>
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNav;
