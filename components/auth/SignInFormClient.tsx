"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { DisplayHeading, Body, Label } from "@/components/typography";

export default function SignInFormClient() {
  const { signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/automation";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn(email.toLowerCase(), password);

    if (!result.success) {
      setError(result.error || "Invalid credentials. Try again.");
      setLoading(false);
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 md:py-24 flex flex-col justify-center min-h-[70vh]">
      <div className="border-2 border-ink rounded-sharp bg-cream shadow-hard p-8">
        <DisplayHeading as="h1" size="sm" className="mb-2 text-center text-ink uppercase select-none">
          Sign In
        </DisplayHeading>
        <Body size="sm" muted className="text-center mb-8 select-none">
          Welcome back. Enter your developer credentials below.
        </Body>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-accent/10 border-2 border-ink rounded text-ink text-body-xs font-semibold text-center select-none">
              ⚠️ {error}
            </div>
          )}

          <div>
            <Label className="text-muted text-body-xs font-bold uppercase tracking-wider block mb-2 select-none">
              Email Address
            </Label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="e.g. user@mlbuilder.in"
              className="w-full bg-surface border-2 border-ink rounded-pill px-4 py-2.5 text-ink focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2 select-none">
              <Label className="text-muted text-body-xs font-bold uppercase tracking-wider">
                Password
              </Label>
              <Link
                href="/forgot-password"
                className="text-body-xs font-bold text-accent hover:underline"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-surface border-2 border-ink rounded-pill pl-4 pr-12 py-2.5 text-ink focus:outline-none focus:border-accent transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/60 hover:text-ink focus:outline-none flex items-center justify-center"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                    <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                    <line x1="2" y1="2" x2="22" y2="22" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center font-body font-semibold text-body-md rounded-pill border-2 border-ink bg-accent text-ink shadow-hard hover:shadow-hard-lg hover:-translate-y-[2px] active:translate-y-0 transition-all duration-150 px-8 py-3.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none"
          >
            {loading ? "Signing In..." : "Sign In →"}
          </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-ink/10 select-none">
          <Body size="sm" muted>
            Don't have an account?{" "}
            <Link href="/sign-up" className="text-accent font-bold hover:underline">
              Sign Up
            </Link>
          </Body>
        </div>
      </div>
    </div>
  );
}
