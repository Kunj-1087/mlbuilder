import React from 'react';
import { cn } from '@/lib/utils';

export interface ScriptTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  size?: 'lg' | 'md' | 'sm';
  muted?: boolean;
}

const sizeClasses = {
  lg: 'text-script-lg',
  md: 'text-script-md',
  sm: 'text-script-sm',
};

/**
 * ScriptText
 * Used for accent lines beneath main titles and hand-drawn style notes.
 * Uses the script font (Caveat).
 */
export function ScriptText({
  size = 'md',
  muted = false,
  children,
  className,
  ...props
}: ScriptTextProps) {
  return (
    <p
      className={cn(
        'font-script',
        muted ? 'text-muted' : 'text-ink',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}
