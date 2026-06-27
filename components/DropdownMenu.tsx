"use client";

import { type ReactNode } from 'react';
import Link from 'next/link';

interface DropdownItem {
  label: string;
  to: string;
  description?: string;
}

interface DropdownMenuProps {
  trigger: ReactNode;
  items: DropdownItem[];
}

export default function DropdownMenu({ trigger, items }: DropdownMenuProps) {
  return (
    <div className="relative group">
      <div className="cursor-pointer">{trigger}</div>
      <div
        className="
          absolute left-0 top-full pt-2
          opacity-0 invisible
          group-hover:opacity-100 group-hover:visible
          transition-all duration-150
          z-50
        "
      >
        <div className="bg-surface border-2 border-ink rounded-sharp shadow-hard-lg min-w-[220px] overflow-hidden">
          {items.map((item) => (
            <Link
              key={item.to}
              href={item.to}
              className="
                block px-5 py-3
                border-b border-ink/10 last:border-0
                font-body text-ink text-sm font-medium
                hover:bg-accent hover:text-cream
                transition-colors duration-100
              "
            >
              <div>{item.label}</div>
              {item.description && (
                <div className="text-muted text-xs mt-0.5 font-normal group-hover/item:text-cream/70">
                  {item.description}
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
