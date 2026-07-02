import React from 'react';
import { cn } from '@/lib/utils';

export interface LabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'tag' | 'metadata';
}

/**
 * Label
 * Used for form input headers, table metrics, pills, and categories.
 * Renders in the body font (Inter) with an uppercase letter-spacing structure.
 */
export function Label({
  variant = 'default',
  children,
  className,
  ...props
}: LabelProps) {
  const variantClasses = {
    default: 'text-ink font-bold',
    tag: 'inline-block px-2.5 py-0.5 border-2 border-ink rounded-pill bg-[#EFEAD8] text-ink font-bold',
    metadata: 'text-muted font-semibold',
  };

  return (
    <span
      className={cn(
        'font-body text-label uppercase tracking-wider',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
