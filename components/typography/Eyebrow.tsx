import React from 'react';
import { cn } from '@/lib/utils';

export interface EyebrowProps extends React.HTMLAttributes<HTMLSpanElement> {
  prefixChar?: '§' | '▸' | string;
}

/**
 * Eyebrow
 * Small uppercase labels shown above main section titles (typically prefixed with § or ▸).
 * Uses the body font (Inter) with wide tracking.
 */
export function Eyebrow({
  prefixChar,
  children,
  className,
  ...props
}: EyebrowProps) {
  return (
    <span
      className={cn(
        'font-body text-eyebrow uppercase font-bold text-muted tracking-widest select-none',
        className
      )}
      {...props}
    >
      {prefixChar && <span className="text-accent">{prefixChar} </span>}
      {children}
    </span>
  );
}
