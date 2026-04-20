import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

const BusyContext = createContext(null);

export function BusyProvider({ children }) {
  const [busyCount, setBusyCount] = useState(0);
  const [message, setMessage] = useState('جاري المعالجة...');
  const nextTokenRef = useRef(0);

  const start = useCallback((nextMessage = 'جاري المعالجة...') => {
    const token = `${Date.now()}-${nextTokenRef.current++}`;
    setMessage(nextMessage);
    setBusyCount((current) => current + 1);
    return token;
  }, []);

  const stop = useCallback(() => {
    setBusyCount((current) => (current > 0 ? current - 1 : 0));
  }, []);

  const withBusy = useCallback(
    async (nextMessage, fn) => {
      start(nextMessage);
      try {
        return await fn();
      } finally {
        stop();
      }
    },
    [start, stop],
  );

  const value = useMemo(
    () => ({
      isBusy: busyCount > 0,
      message,
      start,
      stop,
      withBusy,
    }),
    [busyCount, message, start, stop, withBusy],
  );

  return (
    <BusyContext.Provider value={value}>
      {children}
      {busyCount > 0 && (
        <div
          className="fixed inset-0 z-[250] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          dir="rtl"
        >
          <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl dark:bg-gray-800">
            <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
            <h3 className="text-2xl font-black text-gray-900 dark:text-gray-100">لحظة من فضلك</h3>
            <p className="mt-3 text-lg font-bold leading-8 text-gray-700 dark:text-gray-200">{message}</p>
            <p className="mt-2 text-sm font-bold text-gray-400">يرجى عدم تكرار الضغط حتى يكتمل الطلب</p>
          </div>
        </div>
      )}
    </BusyContext.Provider>
  );
}

export function useBusy() {
  const context = useContext(BusyContext);
  if (!context) {
    throw new Error('useBusy must be used within BusyProvider');
  }
  return context;
}

