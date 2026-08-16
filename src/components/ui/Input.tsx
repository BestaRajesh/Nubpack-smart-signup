import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showCharCount?: boolean;
  currentLength?: number;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      showCharCount = false,
      currentLength,
      maxLength,
      className = '',
      id,
      required,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <div className="flex items-center justify-between">
            <label
              htmlFor={inputId}
              className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider select-none"
            >
              {label}
              {required && <span className="text-rose-500 ml-1 font-bold">*</span>}
            </label>
            {showCharCount && maxLength && (
              <span className="text-[11px] text-[#94A3B8] font-mono font-medium">
                {currentLength ?? 0}/{maxLength}
              </span>
            )}
          </div>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none flex items-center justify-center">
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            maxLength={maxLength}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            className={`w-full bg-[#F1F5F9] text-[#0F172A] font-semibold placeholder:text-[#94A3B8] placeholder:font-normal rounded-2xl text-sm transition-all duration-200 border-2 min-h-[50px] outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
              leftIcon ? 'pl-11' : 'pl-5'
            } ${rightIcon ? 'pr-11' : 'pr-5'} py-3.5 ${
              error
                ? 'border-rose-500 bg-rose-50/50 focus:border-rose-600 focus:bg-white'
                : 'border-transparent focus:border-[#5E2EEF] focus:bg-white'
            } ${className}`}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B] flex items-center justify-center">
              {rightIcon}
            </div>
          )}
        </div>

        {error ? (
          <p id={errorId} className="text-xs font-semibold text-rose-500 flex items-center gap-1.5 mt-0.5 animate-fadeIn">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-500" />
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="text-xs font-medium text-[#64748B] mt-0.5">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
