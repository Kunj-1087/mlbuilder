import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { track, EVENTS } from '@/lib/analytics/track';

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

const SESSION_KEY = 'mlbuilder_session';
const USERS_KEY = 'mlbuilder_users';

interface StoredUser {
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: string;
}

function getStoredUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveStoredUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(SESSION_KEY);
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 600));

    const users = getStoredUsers();
    const match = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!match) {
      return { success: false, error: "We don't have an account with that email. Want to create one instead?" };
    }

    if (match.password !== password) {
      return { success: false, error: "That email and password don't match. Try again." };
    }

    const sessionUser: User = { id: match.id, email: match.email, name: match.name, createdAt: match.createdAt };
    setUser(sessionUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    track(EVENTS.AUTH_SIGNIN_COMPLETED, { source: 'form' });
    return { success: true };
  };

  const signUp = async (email: string, password: string, name: string) => {
    await new Promise((r) => setTimeout(r, 600));

    const users = getStoredUsers();
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (existing) {
      return { success: false, error: "An account with that email already exists. Try signing in instead." };
    }

    const newStored: StoredUser = {
      id: crypto.randomUUID(),
      email: email.toLowerCase(),
      name,
      password,
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...users, newStored];
    saveStoredUsers(updatedUsers);

    const sessionUser: User = { id: newStored.id, email: newStored.email, name: newStored.name, createdAt: newStored.createdAt };
    setUser(sessionUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    track(EVENTS.AUTH_SIGNUP_COMPLETED, { source: 'form' });
    return { success: true };
  };

  const signOut = () => {
    track(EVENTS.AUTH_SIGNOUT, {});
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const updateUser = useCallback((updates: { name?: string; email?: string }) => {
    if (!user) return { success: false, error: 'Not signed in.' };

    if (updates.name !== undefined && (updates.name.trim().length < 2 || updates.name.trim().length > 50)) {
      return { success: false, error: "Name needs to be 2–50 characters." };
    }

    if (updates.email !== undefined && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updates.email)) {
      return { success: false, error: "That email doesn't look right." };
    }

    const users = getStoredUsers();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx === -1) return { success: false, error: "Couldn't find your account. Try again." };

    // If email is changing, check for duplicates
    if (updates.email && updates.email.toLowerCase() !== user.email.toLowerCase()) {
      const dup = users.find((u) => u.email.toLowerCase() === updates.email!.toLowerCase() && u.id !== user.id);
      if (dup) return { success: false, error: "That email is already taken." };
    }

    const updated = { ...users[idx] };
    if (updates.name !== undefined) updated.name = updates.name.trim();
    if (updates.email !== undefined) updated.email = updates.email.toLowerCase();
    users[idx] = updated;
    saveStoredUsers(users);

    const sessionUser: User = { id: updated.id, email: updated.email, name: updated.name, createdAt: updated.createdAt };
    setUser(sessionUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    return { success: true };
  }, [user]);

  const deleteUser = useCallback(() => {
    if (!user) return;

    // Remove from stored users
    const users = getStoredUsers();
    const filtered = users.filter((u) => u.id !== user.id);
    saveStoredUsers(filtered);

    // Mark newsletter subscriber as UNSUBSCRIBED
    try {
      const subKey = 'mlbuilder_subscribers';
      const subs = JSON.parse(localStorage.getItem(subKey) || '[]');
      const sub = subs.find((s: { email: string }) => s.email === user.email.toLowerCase());
      if (sub) {
        sub.status = 'UNSUBSCRIBED';
        localStorage.setItem(subKey, JSON.stringify(subs));
      }
    } catch {
      // Ignore errors in cleanup
    }

    signOut();
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, updateUser, deleteUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
