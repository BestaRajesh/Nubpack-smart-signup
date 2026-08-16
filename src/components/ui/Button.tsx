import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  disabled,
  id,
  type = 'button',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5E2EEF] select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed cursor-pointer';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-2 gap-1.5 min-h-[38px] rounded-xl',
    md: 'text-sm px-5 py-3 gap-2 min-h-[46px] rounded-xl',
    lg: 'text-base sm:text-lg px-6 py-4 sm:py-5 gap-2.5 min-h-[54px] rounded-2xl'
  };

  const variantStyles = {
    primary:
      'bg-[#5E2EEF] hover:bg-[#4C24D1] text-white shadow-xl shadow-[#5E2EEF]/20 active:scale-[0.98]',
    secondary:
      'bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] border-2 border-transparent font-bold',
    outline:
      'bg-white hover:bg-[#5E2EEF]/5 text-[#5E2EEF] border-2 border-[#5E2EEF]',
    ghost:
      'bg-transparent hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A]',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/20',
    success:
      'bg-[#10B981] hover:bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
  };

  return (
    <button
      id={id}
      type={type}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <LoadingSpinner size={size === 'lg' ? 'md' : 'sm'} />
          <span className="whitespace-nowrap">{loadingText || children}</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          <span className="whitespace-nowrap">{children}</span>
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};
