import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import type { ToastMessage, ToastType } from '../../types';

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

export const ToastItem: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const icons: Record<ToastType, React.ReactNode> = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-indigo-500 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
  };

  const borders: Record<ToastType, string> = {
    success: 'border-emerald-200 bg-white',
    error: 'border-rose-200 bg-white',
    info: 'border-indigo-200 bg-white',
    warning: 'border-amber-200 bg-white',
  };

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 w-full max-w-sm p-4 rounded-xl border shadow-lg backdrop-blur-md transition-all duration-200 animate-slide-in-right ${borders[toast.type]}`}
    >
      {icons[toast.type]}
      <div className="flex-1 min-w-0">
        {toast.title && (
          <h4 className="text-sm font-semibold text-slate-900 leading-tight mb-0.5">
            {toast.title}
          </h4>
        )}
        <p className="text-xs text-slate-600 leading-relaxed break-words">{toast.message}</p>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors shrink-0"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const ToastContainer: React.FC<{
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  );
};
