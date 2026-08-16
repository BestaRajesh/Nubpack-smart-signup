import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: (string | SelectOption)[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      placeholder = 'Select an option',
      className = '',
      id,
      required,
      disabled,
      ...props
    },
    ref
  ) => {
    const selectId = id || `select-${Math.random().toString(36).substring(2, 9)}`;
    const errorId = `${selectId}-error`;
    const helperId = `${selectId}-helper`;

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label
            htmlFor={selectId}
            className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider select-none"
          >
            {label}
            {required && <span className="text-rose-500 ml-1 font-bold">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          <select
            id={selectId}
            ref={ref}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            className={`w-full appearance-none bg-[#F1F5F9] text-[#0F172A] font-semibold placeholder:text-[#94A3B8] rounded-2xl text-sm transition-all duration-200 border-2 min-h-[50px] outline-none pl-5 pr-11 py-3.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
              error
                ? 'border-rose-500 bg-rose-50/50 focus:border-rose-600 focus:bg-white'
                : 'border-transparent focus:border-[#5E2EEF] focus:bg-white'
            } ${className}`}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="bg-white text-[#94A3B8]">
                {placeholder}
              </option>
            )}
            {options.map((opt) => {
              const value = typeof opt === 'string' ? opt : opt.value;
              const labelText = typeof opt === 'string' ? opt : opt.label;
              const optDisabled = typeof opt === 'string' ? false : opt.disabled;

              return (
                <option
                  key={value}
                  value={value}
                  disabled={optDisabled}
                  className="bg-white text-[#0F172A] py-1"
                >
                  {labelText}
                </option>
              );
            })}
          </select>

          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none flex items-center justify-center">
            <ChevronDown className="w-4 h-4" />
          </div>
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

Select.displayName = 'Select';
