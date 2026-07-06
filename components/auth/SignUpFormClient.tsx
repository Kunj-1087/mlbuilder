"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DisplayHeading, Body, Label } from "@/components/typography";

export default function SignUpFormClient() {
  const { signUp } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signUp(email.toLowerCase(), password, name);

    if (!result.success) {
      setError(result.error || "Failed to create account.");
      setLoading(false);
    } else {
      router.push("/automation");
      router.refresh();
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 md:py-24 flex flex-col justify-center min-h-[70vh]">
      <div className="border-2 border-ink rounded-sharp bg-cream-muted shadow-hard p-8">
        <DisplayHeading as="h1" size="sm" className="mb-2 text-center text-ink uppercase">
          Sign Up
        </DisplayHeading>
        <Body size="sm" muted className="text-center mb-8">
          Join MLBuilder. It's completely free.
        </Body>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-950/50 border border-red-500 rounded text-red-400 text-body-xs font-semibold text-center">
              ⚠️ {error}
            </div>
          )}

          <div>
            <Label className="text-muted text-body-xs font-bold uppercase tracking-wider block mb-2">
              Full Name
            </Label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. John Doe"
              className="w-full bg-surface border-2 border-ink rounded-pill px-4 py-2.5 text-ink focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          <div>
            <Label className="text-muted text-body-xs font-bold uppercase tracking-wider block mb-2">
              Email Address
            </Label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="e.g. user@mlbuilder.in"
              className="w-full bg-surface border-2 border-ink rounded-pill px-4 py-2.5 text-ink focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          <div>
            <Label className="text-muted text-body-xs font-bold uppercase tracking-wider block mb-2">
              Password (min 6 characters)
            </Label>
            <input
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
            {loading ? "Creating Account..." : "Create Account →"}
          </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-ink/10">
          <Body size="sm" muted>
            Already have an account?{" "}
            <Link href="/sign-in" className="text-accent font-bold hover:underline">
              Sign In
            </Link>
          </Body>
        </div>
      </div>
    </div>
  );
}
