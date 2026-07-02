import React from 'react';
import { cn } from '@/lib/utils';

export interface BodyProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'p' | 'span' | 'div' | 'li';
  size?: 'lg' | 'md' | 'sm' | 'xs';
  muted?: boolean;
}

const sizeClasses = {
  lg: 'text-body-lg',
  md: 'text-body-md',
  sm: 'text-body-sm',
  xs: 'text-body-xs',
};

/**
 * Body
 * Used for standard paragraphs, item descriptions, and user text blocks.
 * Uses the body font (Inter) with a default comfortable line height.
 */
export function Body({
  as: Component = 'p',
  size = 'md',
  muted = false,
  children,
  className,
  ...props
}: BodyProps) {
  return (
    <Component
      className={cn(
        'font-body font-normal',
        muted ? 'text-muted' : 'text-ink',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
