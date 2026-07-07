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
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full bg-surface border-2 border-ink rounded-pill px-4 py-2.5 text-ink focus:outline-none focus:border-accent transition-colors"
            />
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
