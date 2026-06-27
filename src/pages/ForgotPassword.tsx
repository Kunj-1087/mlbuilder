/**
 * Forgot Password Page — /forgot-password
 *
 * Form to request a password reset link.
 * In this client-side SPA, this simulates the reset flow using localStorage tokens.
 */
import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import SeoHead from '@/components/seo/SeoHead';
import { track, EVENTS } from '@/lib/analytics/track';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("That email doesn't look right.");
      return;
    }

    // Simulate API call
    await new Promise((r) => setTimeout(r, 600));

    // Generate and store a reset token in localStorage
    const token = crypto.randomUUID();
    const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour
    const tokens = JSON.parse(localStorage.getItem('mlbuilder_reset_tokens') || '[]');
    tokens.push({ email: email.toLowerCase(), token, expiresAt, usedAt: null });
    localStorage.setItem('mlbuilder_reset_tokens', JSON.stringify(tokens));

    track(EVENTS.CTA_CLICKED, { cta_label: 'forgot_password_request', destination_url: '/forgot-password' });

    // TODO: In production, send PasswordResetEmail via Resend
    console.log(`[DEV] Password reset token for ${email}: ${token}`);
    console.log(`[DEV] Reset URL: /reset-password?token=${token}`);

    setSubmitted(true);
  };

  return (
    <>
      <SeoHead
        title="Forgot Password"
        description="Reset your MLBuilder password."
        path="/forgot-password"
        noindex
      />

      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[480px]">
          {submitted ? (
            <div className="bg-cream border-2 border-ink rounded-sharp shadow-hard p-10 text-center">
              <div className="flex justify-center mb-5">
                <span className="text-4xl">✉️</span>
              </div>
              <h1 className="font-display text-2xl text-ink mb-3">CHECK YOUR INBOX.</h1>
              <p className="font-script text-muted text-lg mb-6">
                If <strong>{email}</strong> is in our system, you'll receive a
                reset link shortly. The link expires in 1 hour.
              </p>
              <Link
                to="/sign-in"
                className="inline-flex items-center justify-center font-body font-semibold text-base rounded-pill border-2 border-ink bg-accent text-ink shadow-hard hover:shadow-hard-lg hover:-translate-y-[2px] transition-all duration-150 px-8 py-3"
              >
                Back to Sign In →
              </Link>
            </div>
          ) : (
            <div className="bg-cream border-2 border-ink rounded-sharp shadow-hard p-10">
              <h1 className="font-display text-3xl text-ink mb-2 text-center">FORGOT PASSWORD.</h1>
              <p className="font-script text-muted text-center text-lg mb-8">
                Enter your email and we'll send a reset link.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  placeholder="your@email.com"
                  className={`w-full px-4 py-3 bg-cream border-2 border-ink rounded-sharp font-body text-ink placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors ${error ? 'border-accent' : ''}`}
                />

                {error && (
                  <p className="font-body text-accent text-sm font-medium">{error}</p>
                )}

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center font-body font-semibold text-base rounded-pill border-2 border-ink bg-accent text-ink shadow-hard hover:shadow-hard-lg hover:-translate-y-[2px] transition-all duration-150 cursor-pointer px-8 py-3"
                >
                  Send Reset Link →
                </button>
              </form>

              <p className="font-body text-muted text-sm text-center mt-6">
                Remember your password?{' '}
                <Link to="/sign-in" className="text-accent hover:text-ink transition-colors">
                  Sign in →
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
