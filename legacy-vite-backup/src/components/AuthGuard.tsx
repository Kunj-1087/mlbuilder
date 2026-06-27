import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-[3px] border-ink border-t-accent rounded-full animate-spin" />
          <p className="font-body text-muted text-sm">Checking your session…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    const callbackUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/sign-in?callbackUrl=${callbackUrl}`} replace />;
  }

  return <>{children}</>;
}
