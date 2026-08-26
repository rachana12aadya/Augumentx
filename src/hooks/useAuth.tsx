import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { storage, type StoredUser } from '@/services/storage';

interface AuthUser {
  email: string;
  name: string;
  role: 'individual' | 'professional' | 'provider' | 'admin';
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  register: (name: string, email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const testAccounts: (AuthUser & { password: string })[] = [
  { email: 'alex@augmentx.demo', password: 'demo123', name: 'Alex Morgan', role: 'individual' },
  { email: 'doctor@augmentx.demo', password: 'demo123', name: 'Dr. Sarah Blake', role: 'professional' },
  { email: 'provider@augmentx.demo', password: 'demo123', name: 'TechCare Inc.', role: 'provider' },
  { email: 'admin@augmentx.demo', password: 'demo123', name: 'System Admin', role: 'admin' },
];

interface RegisteredUser {
  email: string;
  password: string;
  name: string;
  role: string;
}

function getRegisteredUsers(): RegisteredUser[] {
  try {
    const raw = localStorage.getItem('augmentx_registered_users');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = storage.getUser();
    if (stored) {
      return { email: stored.email, name: stored.name, role: stored.role };
    }
    return null;
  });

  const login = useCallback((email: string, password: string) => {
    const account = testAccounts.find(a => a.email === email && a.password === password);
    if (account) {
      const u: AuthUser = { email: account.email, name: account.name, role: account.role };
      setUser(u);
      storage.setUser(u as StoredUser);
      return { success: true };
    }
    const registered = getRegisteredUsers();
    const regUser = registered.find(r => r.email === email && r.password === password);
    if (regUser) {
      const u: AuthUser = { email: regUser.email, name: regUser.name, role: regUser.role as AuthUser['role'] };
      setUser(u);
      storage.setUser(u as StoredUser);
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password' };
  }, []);

  const register = useCallback((name: string, email: string, password: string) => {
    if (testAccounts.some(a => a.email === email)) {
      return { success: false, error: 'Email already registered' };
    }
    const registered = getRegisteredUsers();
    if (registered.some(r => r.email === email)) {
      return { success: false, error: 'Email already registered' };
    }
    registered.push({ email, password, name, role: 'individual' });
    localStorage.setItem('augmentx_registered_users', JSON.stringify(registered));
    const u: AuthUser = { email, name, role: 'individual' };
    setUser(u);
    storage.setUser(u as StoredUser);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    storage.setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
