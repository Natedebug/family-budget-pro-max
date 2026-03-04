
import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  const cardClasses = `
    bg-slate-800 
    rounded-2xl 
    shadow-lg 
    p-4 
    transition-all 
    duration-300
    ${onClick ? 'cursor-pointer hover:bg-slate-700 hover:shadow-xl' : ''}
    ${className}
  `;
  return (
    <div className={cardClasses} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;
