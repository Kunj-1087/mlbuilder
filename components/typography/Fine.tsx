import React from 'react';
import { cn } from '@/lib/utils';

export interface FineProps extends React.HTMLAttributes<HTMLElement> {
  muted?: boolean;
}

/**
 * Fine
 * Small footer copyright labels, warning details, and validation helper lines.
 * Uses the body font (Inter) with the micro scale token.
 */
export function Fine({
  muted = true,
  children,
  className,
  ...props
}: FineProps) {
  return (
    <small
      className={cn(
        'font-body text-fine block',
        muted ? 'text-muted' : 'text-ink',
        className
      )}
      {...props}
    >
      {children}
    </small>
  );
}
