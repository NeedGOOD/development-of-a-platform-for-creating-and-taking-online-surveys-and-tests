import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  getCurrentUser,
  isAuthenticated,
  loginWithPassword,
  logout as logoutApi,
  updateCurrentUser,
} from '../testdata';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (isAuthenticated()) {
      setUser(getCurrentUser());
    } else {
      setUser(null);
    }

    setReady(true);
  }, []);

  const login = useCallback(async ({ email, password } = {}) => {
    const nextUser = loginWithPassword({ email, password });
    setUser(nextUser);
    return nextUser;
  }, []);

  const logout = useCallback(() => {
    logoutApi();
    setUser(null);
  }, []);

  const updateProfile = useCallback((patch) => {
    const nextUser = updateCurrentUser(patch);
    setUser(nextUser);
    return nextUser;
  }, []);

  const refresh = useCallback(() => {
    if (isAuthenticated()) {
      setUser(getCurrentUser());
      return;
    }

    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      ready,
      user,
      login,
      logout,
      updateProfile,
      refresh,
    }),
    [ready, user, login, logout, updateProfile, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}

