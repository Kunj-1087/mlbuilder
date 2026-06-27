/**
 * Minimal toast notification system for MLBuilder.
 *
 * Uses a simple in-memory event emitter pattern.
 * Mount <Toaster /> in the root layout once.
 */

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

type Listener = (toasts: Toast[]) => void;

let toasts: Toast[] = [];
let listeners: Listener[] = [];
let idCounter = 0;

function notify() {
  for (const listener of listeners) {
    listener([...toasts]);
  }
}

function addToast(message: string, type: ToastType, duration: number) {
  const id = `toast-${++idCounter}`;
  const toast: Toast = { id, message, type, duration };
  toasts = [...toasts.slice(-2), toast]; // Max 3 toasts (keep newest 3)
  notify();

  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    notify();
  }, duration);
}

export const toast = {
  success(message: string) {
    addToast(message, 'success', 3000);
  },
  error(message: string) {
    addToast(message, 'error', 4000);
  },
  info(message: string) {
    addToast(message, 'info', 3000);
  },
};

export function subscribeToasts(listener: Listener): () => void {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

export function getToasts(): Toast[] {
  return [...toasts];
}
