import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { authApi, TOKEN_KEY } from '../services/api.js';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(!!localStorage.getItem(TOKEN_KEY));

  const logout = useCallback(() => { localStorage.removeItem(TOKEN_KEY); setUser(null); }, []);

  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) return;
    authApi.me().then(setUser).catch(() => localStorage.removeItem(TOKEN_KEY)).finally(() => setBooting(false));
  }, []);

  useEffect(() => {
    window.addEventListener('spendwise:logout', logout);
    return () => window.removeEventListener('spendwise:logout', logout);
  }, [logout]);

  const accept = ({ token, user: u }) => { localStorage.setItem(TOKEN_KEY, token); setUser(u); };
  const value = {
    user, booting, logout, setUser,
    login: async (d) => accept(await authApi.login(d)),
    register: async (d) => accept(await authApi.register(d)),
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
