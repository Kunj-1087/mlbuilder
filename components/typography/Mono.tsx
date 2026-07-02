import React from 'react';
import { cn } from '@/lib/utils';

export interface MonoProps extends React.HTMLAttributes<HTMLElement> {
}

/**
 * Mono
 * Technical variables, command parameters, inline code fragments, and code blocks.
 * Renders in standard Monospace font (Geist Mono).
 */
export function Mono({
  children,
  className,
  ...props
}: MonoProps) {
  return (
    <code
      className={cn(
        'font-mono text-xs bg-[#EFEAD8] border border-ink/20 rounded-sharp px-1.5 py-0.5 text-ink',
        className
      )}
      {...props}
    >
      {children}
    </code>
  );
}
