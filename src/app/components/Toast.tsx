'use client';

import { useEffect, useState } from 'react';
import { ToastMessage, getToasts, clearToast } from '@/app/actions/notifications';

export function Toast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const checkForToasts = async () => {
      const newToasts = await getToasts();
      if (newToasts.length > 0) {
        setToasts((currentToasts) => [...currentToasts, ...newToasts]);
      }
    };

    // Check for toasts immediately
    checkForToasts();

    // Set up polling interval
    const interval = setInterval(checkForToasts, 1000);

    return () => clearInterval(interval);
  }, []);

  // Auto-dismiss toasts after 5 seconds
  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        const [, ...remainingToasts] = toasts;
        setToasts(remainingToasts);
        if (toasts[0]) {
          clearToast(toasts[0].id);
        }
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [toasts]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-lg px-4 py-3 shadow-lg transition-all duration-300 ease-in-out
            ${toast.type === 'success' ? 'bg-green-500 text-white' : ''}
            ${toast.type === 'error' ? 'bg-red-500 text-white' : ''}
            ${toast.type === 'info' ? 'bg-blue-500 text-white' : ''}
          `}
        >
          <p className="text-sm font-medium">{toast.message}</p>
        </div>
      ))}
    </div>
  );
} 