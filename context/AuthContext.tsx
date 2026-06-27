"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "next-auth/react";
import { toast } from "@/lib/toast";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
  updateUser: (updates: { name?: string; email?: string }) => { success: boolean; error?: string };
  deleteUser: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status, update } = useSession();
  const loading = status === "loading";

  const user = useMemo<User | null>(() => {
    if (!session?.user) return null;
    return {
      id: session.user.id || "",
      email: session.user.email || "",
      name: session.user.name || "",
      avatar: session.user.image || undefined,
      createdAt: new Date().toISOString(), // fallback
    };
  }, [session]);

  const signIn = async (email: string, password: string) => {
    try {
      const res = await nextAuthSignIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        return { success: false, error: "Invalid credentials. Try again." };
      }

      return { success: true };
    } catch (err) {
      return { success: false, error: "Something went wrong. Try again." };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const signupRes = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await signupRes.json();

      if (!signupRes.ok) {
        return { success: false, error: data.error || "Could not complete signup." };
      }

      // Auto sign in on success
      return await signIn(email, password);
    } catch (err) {
      return { success: false, error: "Network error during signup." };
    }
  };

  const signOut = () => {
    nextAuthSignOut({ redirect: true, callbackUrl: "/" });
  };

  const updateUser = (updates: { name?: string; email?: string }) => {
    update(updates);
    return { success: true };
  };

  const deleteUser = () => {
    toast.info("Account deletion initiated.");
    signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, updateUser, deleteUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
