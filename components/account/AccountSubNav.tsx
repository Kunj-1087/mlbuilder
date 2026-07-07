"use client";

/**
 * AccountSubNav — horizontal tab-style nav for account pages.
 *
 * Shared between /account (Dashboard) and /account/saved (Saved Items).
 */
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getBookmarkCount } from '@/lib/bookmarks';

export default function AccountSubNav() {
  const { user } = useAuth();
  const pathname = usePathname();
  const isSaved = pathname.startsWith('/account/saved');
  const bookmarkCount = user ? getBookmarkCount(user.id) : 0;

  const tabs = [
    { label: 'Dashboard', to: '/account', active: pathname === '/account' },
    { label: 'Saved Items', to: '/account/saved', active: isSaved, count: bookmarkCount },
  ];

  return (
    <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
      {tabs.map((tab) => (
        <Link
          key={tab.to}
          href={tab.to}
          className={`
            inline-flex items-center gap-1.5
            px-4 py-2 rounded-pill
            border-2 border-ink
            font-body text-[14px] font-semibold
            transition-all duration-150 whitespace-nowrap
            ${tab.active
              ? 'bg-accent text-ink shadow-hard-sm'
              : 'bg-cream text-ink hover:bg-surface shadow-hard-sm hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]'
            }
          `}
        >
          {tab.label}
          {tab.count && tab.count > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-pill bg-ink text-cream text-[10px] font-bold leading-none">
              {tab.count}
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}
