import { CheckCircle2, Info, TriangleAlert, X } from 'lucide-react';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ToastContext = createContext(null);

const TOAST_STYLES = {
  success: {
    icon: CheckCircle2,
    accent: 'border-emerald-500',
    iconColor: 'text-emerald-600',
  },
  error: {
    icon: TriangleAlert,
    accent: 'border-red-500',
    iconColor: 'text-red-600',
  },
  info: {
    icon: Info,
    accent: 'border-sky-500',
    iconColor: 'text-sky-600',
  },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    setToasts((current) => [...current, { id, message, type }]);

    window.setTimeout(() => {
      removeToast(id);
    }, 3200);
  }, [removeToast]);

  const value = useMemo(() => ({ addToast, removeToast }), [addToast, removeToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="fixed top-4 right-4 z-[260] w-[min(28rem,calc(100vw-2rem))] space-y-3"
        dir="rtl"
      >
        {toasts.map((toast) => {
          const style = TOAST_STYLES[toast.type] || TOAST_STYLES.info;
          const Icon = style.icon;

          return (
            <div
              key={toast.id}
              className={`flex items-start gap-3 rounded-2xl border-r-4 ${style.accent} bg-white/95 p-4 shadow-xl backdrop-blur dark:bg-gray-900/95`}
            >
              <Icon className={`mt-0.5 h-5 w-5 flex-shrink-0 ${style.iconColor}`} />
              <p className="flex-1 text-base font-bold leading-7 text-gray-800 dark:text-gray-100">{toast.message}</p>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }

  return context;
}
