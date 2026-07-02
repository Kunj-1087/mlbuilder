import React from 'react';
import { cn } from '@/lib/utils';

export interface SectionHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'div' | 'span';
  size?: 'lg' | 'md' | 'sm';
}

const sizeClasses = {
  lg: 'text-heading-lg',
  md: 'text-heading-md',
  sm: 'text-heading-sm',
};

/**
 * SectionHeading
 * Used for middle-level section breaks within pages.
 * Uses the display font (Archivo Black), always uppercase, with slightly wider spacing than DisplayHeading.
 */
export function SectionHeading({
  as: Component = 'h2',
  size = 'lg',
  children,
  className,
  ...props
}: SectionHeadingProps) {
  return (
    <Component
      className={cn(
        'font-display uppercase text-ink tracking-normal',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
