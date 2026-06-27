"use client";

/**
 * Toaster â€” renders toast notifications at bottom-center of viewport.
 *
 * Mount once in the root layout. Uses the toast lib for state.
 */
import { useState, useEffect } from 'react';
import { subscribeToasts, getToasts, type Toast } from '@/lib/toast';

function ToastIcon({ type }: { type: Toast['type'] }) {
  if (type === 'success') {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M13 4L6 12L3 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (type === 'error') {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 5V8.5M8 11V11.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>(getToasts());

  useEffect(() => {
    return subscribeToasts(setToasts);
  }, []);

  if (toasts.length === 0) return null;

  const typeStyles: Record<Toast['type'], string> = {
    success: 'bg-accent text-ink',
    error: 'bg-ink text-cream',
    info: 'bg-cream text-ink border-2 border-ink',
  };

  return (
    <div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-2 items-center"
      aria-live="polite"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`
            flex items-center gap-2
            px-4 py-2.5 rounded-pill
            border-2 border-ink
            shadow-hard-sm
            font-body text-[13px] font-semibold
            ${typeStyles[t.type]}
            toast-enter
          `}
          role="status"
        >
          <ToastIcon type={t.type} />
          {t.message}
        </div>
      ))}
    </div>
  );
}

