import React, { createContext, useContext, useState, useCallback } from 'react';
import { ToastMessage } from '../types/signup';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ToastContextType {
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = { ...toast, id };
    
    setToasts((prev) => [...prev, newToast]);

    const duration = toast.duration ?? 4000;
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, [removeToast]);

  const success = useCallback((message: string, title?: string) => {
    showToast({ type: 'success', message, title });
  }, [showToast]);

  const error = useCallback((message: string, title?: string) => {
    showToast({ type: 'error', message, title });
  }, [showToast]);

  const info = useCallback((message: string, title?: string) => {
    showToast({ type: 'info', message, title });
  }, [showToast]);

  const warning = useCallback((message: string, title?: string) => {
    showToast({ type: 'warning', message, title });
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full px-4 pointer-events-none" id="toast-container">
        <AnimatePresence>
          {toasts.map((t) => {
            const icons = {
              success: <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0" />,
              error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
              info: <Info className="w-5 h-5 text-[#5E2EEF] shrink-0" />,
              warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
            };

            const borderColors = {
              success: 'border-[#10B981]/30',
              error: 'border-rose-300',
              info: 'border-[#5E2EEF]/30',
              warning: 'border-amber-300'
            };

            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl bg-white border-2 shadow-xl ${borderColors[t.type]}`}
                role="alert"
                id={`toast-${t.id}`}
              >
                <div className="pt-0.5">{icons[t.type]}</div>
                <div className="flex-1 min-w-0">
                  {t.title && <h4 className="text-sm font-bold text-[#0F172A] leading-tight mb-0.5">{t.title}</h4>}
                  <p className="text-xs font-medium text-[#64748B] leading-relaxed break-words">{t.message}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeToast(t.id)}
                  className="text-[#94A3B8] hover:text-[#0F172A] transition-colors p-1 rounded-lg hover:bg-[#F1F5F9] cursor-pointer"
                  aria-label="Close notification"
                  id={`toast-close-${t.id}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
