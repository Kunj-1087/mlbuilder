"use client";

import { ReactNode, Suspense } from "react";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/context/AuthContext";
import { SearchProvider } from "@/lib/search/SearchContext";
import PostHogProvider from "@/components/analytics/PostHogProvider";
import ErrorBoundary from "@/components/errors/ErrorBoundary";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <AuthProvider>
        <Suspense fallback={null}>
          <PostHogProvider>
            <SearchProvider>
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
            </SearchProvider>
          </PostHogProvider>
        </Suspense>
      </AuthProvider>
    </SessionProvider>
  );
}
