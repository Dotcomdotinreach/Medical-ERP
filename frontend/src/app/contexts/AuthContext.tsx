import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { authApi, type AuthUser } from "../services/auth";
import { setTokens, loadTokens, clearTokens, onUnauthorized } from "../services/api";

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  refreshUser: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    setUser(null);
    clearTokens();
  }, []);

  useEffect(() => {
    onUnauthorized(logout);
    const { accessToken } = loadTokens();
    if (accessToken) {
      authApi.getProfile()
        .then((res) => setUser(res.data.user))
        .catch(() => { clearTokens(); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [logout]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    setTokens(res.data.accessToken, res.data.refreshToken);
    setUser(res.data.user);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const res = await authApi.getProfile();
      setUser(res.data.user);
    } catch {
      // silent
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
