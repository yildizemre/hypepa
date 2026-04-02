import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as apiLogin, setToken, getToken, type AppUser } from '../lib/api';

const STORAGE_KEY = 'orbitra_user';

interface AuthContextType {
  user: AppUser | null;
  /** Admin panelde "X kullanıcısı olarak görüntüle" için; menü ve yetkiler buna göre davranır */
  viewAsUser: AppUser | null;
  setViewAsUser: (u: AppUser | null) => void;
  /** Menü ve rol bazlı UI için: viewAsUser varsa o, yoksa user */
  effectiveUser: AppUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function loadStoredUser(): AppUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data?.id && data?.username && data?.role) return data as AppUser;
  } catch {
    // ignore
  }
  return null;
}

function saveStoredUser(user: AppUser | null) {
  if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  else localStorage.removeItem(STORAGE_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(loadStoredUser);
  const [viewAsUser, setViewAsUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const effectiveUser = viewAsUser ?? user;

  useEffect(() => {
    if (!getToken() && user) {
      setUser(null);
      saveStoredUser(null);
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const { user: loggedUser, token } = await apiLogin(username, password);
      setToken(token);
      setUser(loggedUser);
      saveStoredUser(loggedUser);
      return { success: true };
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Giriş yapılamadı.';
      return { success: false, error: message };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    saveStoredUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        viewAsUser,
        setViewAsUser,
        effectiveUser,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
