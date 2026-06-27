import { useState, type FormEvent } from 'react';
import { Link, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import PillButton from '@/components/PillButton';

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
}

interface AuthFormProps {
  mode: 'sign-in' | 'sign-up';
}

const config = {
  'sign-in': {
    heading: 'SIGN IN TO YOUR ACCOUNT',
    subtext: 'Get access to automation breakdowns, research notes, and tools — all in one place.',
    cta: 'Sign In →',
    ctaLoading: 'Signing in…',
    bottomText: "Don't have an account?",
    bottomLink: 'Create one',
    bottomTo: '/sign-up',
  },
  'sign-up': {
    heading: 'CREATE YOUR ACCOUNT',
    subtext: 'One free account gets you into everything — automation workflows, research digests, and the full tools library.',
    cta: 'Create Account →',
    ctaLoading: 'Creating account…',
    bottomText: 'Already have an account?',
    bottomLink: 'Sign in',
    bottomTo: '/sign-in',
  },
};

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validate(mode: 'sign-in' | 'sign-up', name: string, email: string, password: string): FieldErrors {
  const errors: FieldErrors = {};

  if (mode === 'sign-up') {
    if (!name.trim()) {
      errors.name = 'We need your name.';
    }
  }

  if (!email.trim()) {
    errors.email = 'We need your email.';
  } else if (!validateEmail(email)) {
    errors.email = "That doesn't look like a valid email.";
  }

  if (!password) {
    errors.password = 'We need a password.';
  } else if (password.length < 8) {
    errors.password = 'Your password needs at least 8 characters.';
  }

  return errors;
}

export default function AuthForm({ mode }: AuthFormProps) {
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Parse callbackUrl from URL — where to go after login
  const searchParams = new URLSearchParams(location.search);
  const rawCallback = searchParams.get('callbackUrl') || '/automation';
  const callbackUrl = rawCallback.startsWith('/') ? rawCallback : '/automation';

  // Preserve search params when toggling between sign-in / sign-up
  const searchString = location.search;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  // Already signed in — go to callbackUrl or /automation
  if (user) {
    return <Navigate to={callbackUrl} replace />;
  }

  const c = config[mode];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError('');

    const errors = validate(mode, name, email, password);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setLoading(true);

    let result;
    if (mode === 'sign-in') {
      result = await signIn(email, password);
    } else {
      result = await signUp(email, password, name);
    }

    setLoading(false);

    if (result.success) {
      navigate(callbackUrl);
    } else {
      setServerError(result.error || 'Something went wrong. Please try again.');
    }
  };

  const clearFieldError = (field: keyof FieldErrors) => {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[480px]">

        <div className="bg-surface border-2 border-ink rounded-sharp shadow-hard p-8 md:p-10">

          {/* Star mark */}
          <div className="flex justify-center mb-5">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path
                d="M14 0L16.4 11.6L28 14L16.4 16.4L14 28L11.6 16.4L0 14L11.6 11.6L14 0Z"
                fill="#FF6A1A"
                stroke="#111111"
                strokeWidth="1.5"
              />
            </svg>
          </div>

          {/* ── Pill toggle ── */}
          <div className="flex border-2 border-ink rounded-pill overflow-hidden mb-8 shadow-hard-sm">
            <Link
              to={`/sign-in${searchString}`}
              className={`
                flex-1 text-center py-2 font-body font-semibold text-sm
                transition-colors duration-150
                ${mode === 'sign-in'
                  ? 'bg-ink text-cream'
                  : 'bg-surface text-ink hover:bg-ink/5'
                }
              `}
            >
              Sign In
            </Link>
            <Link
              to={`/sign-up${searchString}`}
              className={`
                flex-1 text-center py-2 font-body font-semibold text-sm
                border-l-2 border-ink
                transition-colors duration-150
                ${mode === 'sign-up'
                  ? 'bg-ink text-cream'
                  : 'bg-surface text-ink hover:bg-ink/5'
                }
              `}
            >
              Create Account
            </Link>
          </div>

          {/* Heading */}
          <h1 className="font-display text-2xl md:text-3xl text-ink text-center mb-2 leading-tight">
            {c.heading}
          </h1>

          {/* Subtext */}
          <p className="font-body text-muted text-sm text-center mb-7 leading-relaxed">
            {c.subtext}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>

            {/* Name field (sign-up only) */}
            {mode === 'sign-up' && (
              <div>
                <label htmlFor="name" className="block font-body text-sm font-semibold text-ink mb-1.5">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); clearFieldError('name'); }}
                  autoComplete="name"
                  className={`
                    w-full px-4 py-2.5 bg-cream border-2 border-ink rounded-sharp
                    font-body text-ink placeholder:text-muted/50
                    focus:outline-none focus:border-accent focus:shadow-hard-sm
                    transition-all
                    ${fieldErrors.name ? 'border-accent' : ''}
                  `}
                  placeholder="What should we call you?"
                />
                {fieldErrors.name && (
                  <p className="font-body text-accent text-xs mt-1.5 font-medium">{fieldErrors.name}</p>
                )}
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block font-body text-sm font-semibold text-ink mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); clearFieldError('email'); }}
                autoComplete="email"
                className={`
                  w-full px-4 py-2.5 bg-cream border-2 border-ink rounded-sharp
                  font-body text-ink placeholder:text-muted/50
                  focus:outline-none focus:border-accent focus:shadow-hard-sm
                  transition-all
                  ${fieldErrors.email ? 'border-accent' : ''}
                `}
                placeholder="you@example.com"
              />
              {fieldErrors.email && (
                <p className="font-body text-accent text-xs mt-1.5 font-medium">{fieldErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block font-body text-sm font-semibold text-ink mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); clearFieldError('password'); }}
                autoComplete={mode === 'sign-up' ? 'new-password' : 'current-password'}
                className={`
                  w-full px-4 py-2.5 bg-cream border-2 border-ink rounded-sharp
                  font-body text-ink placeholder:text-muted/50
                  focus:outline-none focus:border-accent focus:shadow-hard-sm
                  transition-all
                  ${fieldErrors.password ? 'border-accent' : ''}
                `}
                placeholder="At least 8 characters"
              />
              {fieldErrors.password && (
                <p className="font-body text-accent text-xs mt-1.5 font-medium">{fieldErrors.password}</p>
              )}

              {/* Forgot password link — sign-in only */}
              {mode === 'sign-in' && (
                <div className="text-right">
                  <Link to="/forgot-password" className="font-body text-muted text-xs hover:text-accent transition-colors">
                    Forgot password?
                  </Link>
                </div>
              )}
            </div>

            {/* Server error */}
            {serverError && (
              <div className="bg-accent/10 border-2 border-accent rounded-sharp p-3">
                <p className="font-body text-accent text-sm font-medium">{serverError}</p>
              </div>
            )}

            {/* Submit */}
            <PillButton
              type="submit"
              variant="primary"
              size="md"
              disabled={loading}
              className="w-full"
            >
              {loading ? c.ctaLoading : c.cta}
            </PillButton>
          </form>

          {/* Bottom link */}
          <div className="mt-6 pt-5 border-t-2 border-ink/10 text-center">
            <p className="font-body text-muted text-sm">
              {c.bottomText}{' '}
              <Link to={`${c.bottomTo}${searchString}`} className="text-accent font-semibold hover:text-ink transition-colors">
                {c.bottomLink}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
