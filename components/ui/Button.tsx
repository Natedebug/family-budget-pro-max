import React, { ReactNode } from 'react';

// FIX: Add `disabled` prop to ButtonProps to allow buttons to be disabled.
interface ButtonProps {
  children: ReactNode;
  onClick: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
}

// FIX: Pass the `disabled` prop to the underlying button element and add Tailwind classes for the disabled state.
const Button: React.FC<ButtonProps> = ({ children, onClick, className = '', variant = 'primary', disabled }) => {
  const baseClasses = "px-4 py-2 rounded-lg font-bold text-sm transition-transform duration-200 active:scale-95 shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const styles = {
    primary: "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 border border-transparent",
    secondary: "bg-slate-600 text-white hover:bg-slate-500 border border-transparent",
    outline: "bg-transparent border border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white",
  };

  return (
    <button onClick={onClick} disabled={disabled} className={`${baseClasses} ${styles[variant]} ${className}`}>
      {children}
    </button>
  );
};

export default Button;
