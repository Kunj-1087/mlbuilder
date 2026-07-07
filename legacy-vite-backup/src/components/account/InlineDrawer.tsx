import { type ReactNode } from 'react';

interface InlineDrawerProps {
  open: boolean;
  children: ReactNode;
}

export default function InlineDrawer({ open, children }: InlineDrawerProps) {
  if (!open) return null;

  return (
    <div
      className="mt-4 border-2 border-ink rounded-sharp bg-cream shadow-hard p-6"
      style={{ animation: 'drawerSlideDown 200ms ease-out' }}
    >
      {children}

      <style>{`
        @keyframes drawerSlideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
