/**
 * Reset Password Page — /reset-password?token=xxx
 *
 * Sets a new password using a valid reset token.
 * In this client-side SPA, validates the token against localStorage.
 */
import { useState, useEffect, type FormEvent } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import SeoHead from '@/components/seo/SeoHead';
import { track, EVENTS } from '@/lib/analytics/track';

interface StoredToken {
  email: string;
  token: string;
  expiresAt: number;
  usedAt: string | null;
}

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState('');

  // Validate token on mount
  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      return;
    }

    const tokens: StoredToken[] = JSON.parse(localStorage.getItem('mlbuilder_reset_tokens') || '[]');
    const found = tokens.find((t) => t.token === token);

    if (!found || found.usedAt || Date.now() > found.expiresAt) {
      setTokenValid(false);
      return;
    }

    setTokenValid(true);
    setUserEmail(found.email);
  }, [token]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError('Password needs to be at least 8 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    // Simulate API call
    await new Promise((r) => setTimeout(r, 600));

    // Mark token as used
    const tokens: StoredToken[] = JSON.parse(localStorage.getItem('mlbuilder_reset_tokens') || '[]');
    const idx = tokens.findIndex((t) => t.token === token);
    if (idx !== -1) {
      tokens[idx].usedAt = new Date().toISOString();
      localStorage.setItem('mlbuilder_reset_tokens', JSON.stringify(tokens));
    }

    // TODO: In production, hash the password and update User record
    console.log(`[DEV] Password reset for ${userEmail} — new password set`);

    track(EVENTS.CTA_CLICKED, { cta_label: 'password_reset_completed', destination_url: '/sign-in' });

    setSuccess(true);
  };

  // Invalid/missing token
  if (tokenValid === false) {
    return (
      <>
        <SeoHead title="Reset Password" path="/reset-password" noindex />
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
          <div className="bg-cream border-2 border-ink rounded-sharp shadow-hard p-10 text-center max-w-[480px]">
            <h1 className="font-display text-2xl text-ink mb-3">LINK EXPIRED.</h1>
            <p className="font-script text-muted text-lg mb-8">
              This reset link is invalid or has already been used.
            </p>
            <Link
              to="/forgot-password"
              className="inline-flex items-center justify-center font-body font-semibold text-base rounded-pill border-2 border-ink bg-accent text-ink shadow-hard hover:shadow-hard-lg hover:-translate-y-[2px] transition-all duration-150 px-8 py-3"
            >
              Request a New Link →
            </Link>
          </div>
        </div>
      </>
    );
  }

  // Still loading
  if (tokenValid === null) {
    return null;
  }

  return (
    <>
      <SeoHead
        title="Reset Password"
        description="Set a new password for your MLBuilder account."
        path="/reset-password"
        noindex
      />

      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[480px]">
          {success ? (
            <div className="bg-cream border-2 border-ink rounded-sharp shadow-hard p-10 text-center">
              <div className="flex justify-center mb-5">
                <span className="text-4xl">✅</span>
              </div>
              <h1 className="font-display text-2xl text-ink mb-3">PASSWORD UPDATED.</h1>
              <p className="font-script text-muted text-lg mb-8">
                Your password has been reset. Sign in with your new password.
              </p>
              <Link
                to="/sign-in"
                className="inline-flex items-center justify-center font-body font-semibold text-base rounded-pill border-2 border-ink bg-accent text-ink shadow-hard hover:shadow-hard-lg hover:-translate-y-[2px] transition-all duration-150 px-8 py-3"
              >
                Sign In →
              </Link>
            </div>
          ) : (
            <div className="bg-cream border-2 border-ink rounded-sharp shadow-hard p-10">
              <h1 className="font-display text-3xl text-ink mb-2 text-center">NEW PASSWORD.</h1>
              <p className="font-script text-muted text-center text-lg mb-8">
                Set a new password for {userEmail}.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
                  placeholder="New password (min 8 characters)"
                  className={`w-full px-4 py-3 bg-cream border-2 border-ink rounded-sharp font-body text-ink placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors ${error ? 'border-accent' : ''}`}
                />

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                  placeholder="Confirm new password"
                  className={`w-full px-4 py-3 bg-cream border-2 border-ink rounded-sharp font-body text-ink placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors ${error ? 'border-accent' : ''}`}
                />

                {error && (
                  <p className="font-body text-accent text-sm font-medium">{error}</p>
                )}

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center font-body font-semibold text-base rounded-pill border-2 border-ink bg-accent text-ink shadow-hard hover:shadow-hard-lg hover:-translate-y-[2px] transition-all duration-150 cursor-pointer px-8 py-3"
                >
                  Set New Password →
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
