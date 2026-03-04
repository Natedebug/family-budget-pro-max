import React from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  color: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, max, color }) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;

  return (
    <div className="w-full bg-slate-700 rounded-full h-2">
      <div 
        className={`bg-${color} h-2 rounded-full`}
        style={{ width: `${Math.min(percentage, 100)}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;