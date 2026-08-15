import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { citizenService } from '../services/citizenService';
import { getToken, setToken as persistToken, ApiError } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function bootstrap() {
      if (!getToken()) {
        setLoading(false);
        return;
      }
      try {
        const { user: me } = await citizenService.me();
        if (!cancelled) setUser(me);
      } catch {
        persistToken(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  const register = useCallback(async (name, phone, password) => {
    const { token, user: newUser } = await citizenService.register(name, phone, password);
    persistToken(token);
    setUser(newUser);
  }, []);

  const login = useCallback(async (phone, password) => {
    const { token, user: loggedInUser } = await citizenService.login(phone, password);
    persistToken(token);
    setUser(loggedInUser);
  }, []);

  const logout = useCallback(() => {
    persistToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), loading, register, login, logout }),
    [user, loading, register, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export { ApiError };
