import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AuthGuard from '@/components/AuthGuard';
import SeoHead from '@/components/seo/SeoHead';
import AccountSubNav from '@/components/account/AccountSubNav';
import BorderedCard from '@/components/BorderedCard';
import PillButton from '@/components/PillButton';
import { getBookmarkCount } from '@/lib/bookmarks';

export default function Account() {
  return (
    <AuthGuard>
      <SeoHead
        title="My Account"
        description="Your MLBuilder account dashboard — profile, saved items, and settings."
        path="/account"
        noindex
      />
      <AccountContent />
    </AuthGuard>
  );
}

function AccountContent() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  const bookmarkCount = getBookmarkCount(user.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Hero */}
      <section className="mb-0">
        <p className="font-body text-[13px] font-semibold uppercase tracking-[0.1em] text-ink mb-4">
          § MLBUILDER / MY ACCOUNT
        </p>

        <h1 className="font-display text-[60px] sm:text-7xl md:text-8xl lg:text-9xl xl:text-[140px] leading-[0.95] tracking-tight mb-4">
          <span className="block">
            <span className="text-ink">YOUR</span>{' '}
            <span className="text-accent">ACCOUNT.</span>
          </span>
        </h1>

        <p className="font-script text-ink text-[22px] sm:text-2xl md:text-[26px] leading-snug max-w-xl mb-0">
          Everything on file. Nothing hidden.
        </p>

        <div className="h-[2px] bg-ink mt-12" />
      </section>

      {/* Sub-nav */}
      <AccountSubNav />

      {/* Dashboard grid */}
      <div className="max-w-lg space-y-6">
        {/* Profile card */}
        <BorderedCard>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center text-cream font-display text-2xl border-2 border-ink shadow-hard-sm flex-shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h2 className="font-display text-lg text-ink truncate">{user.name}</h2>
              <p className="font-body text-muted text-sm truncate">{user.email}</p>
            </div>
          </div>

          {/* Activity summary */}
          <div className="pt-5 border-t-2 border-ink/10">
            <p className="font-body text-[12px] font-semibold uppercase tracking-[0.1em] text-muted mb-3">
              ACTIVITY SUMMARY
            </p>

            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <span className="font-body text-sm text-ink">Items saved</span>
                <span className="font-display text-lg text-accent">{bookmarkCount}</span>
              </div>
              {bookmarkCount > 0 && (
                <Link
                  to="/account/saved"
                  className="font-body text-[13px] font-semibold text-accent hover:text-ink transition-colors"
                >
                  View all →
                </Link>
              )}
            </div>
          </div>

          {/* Sign out */}
          <div className="pt-4 border-t-2 border-ink/10 mt-4">
            <PillButton
              onClick={handleSignOut}
              variant="ghost"
              size="md"
            >
              Sign Out
            </PillButton>
          </div>
        </BorderedCard>
      </div>
    </div>
  );
}
