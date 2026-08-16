import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export interface AlertProps {
  type?: 'error' | 'success' | 'warning' | 'info';
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
  id?: string;
}

export function Alert({
  type = 'info',
  title,
  children,
  onClose,
  className = '',
  id
}: AlertProps) {
  const iconMap = {
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />,
    success: <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />,
    info: <Info className="w-5 h-5 text-[#5E2EEF] shrink-0 mt-0.5" />
  };

  const styleMap = {
    error: 'bg-rose-50 border-2 border-rose-200 text-rose-900',
    success: 'bg-emerald-50 border-2 border-emerald-200 text-emerald-900',
    warning: 'bg-amber-50 border-2 border-amber-200 text-amber-900',
    info: 'bg-[#5E2EEF]/5 border-2 border-[#5E2EEF]/15 text-[#0F172A]'
  };

  return (
    <div
      id={id}
      role="alert"
      className={`flex items-start gap-3 p-4 rounded-2xl border text-sm leading-relaxed ${styleMap[type]} ${className}`}
    >
      {iconMap[type]}
      <div className="flex-1 min-w-0">
        {title && <h5 className="font-bold text-[#0F172A] mb-1 leading-tight">{title}</h5>}
        <div className="text-xs sm:text-sm font-medium">{children}</div>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-[#64748B] hover:text-[#0F172A] p-1 rounded-lg transition-colors cursor-pointer"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
