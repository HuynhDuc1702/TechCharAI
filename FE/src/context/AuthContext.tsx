import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { logout as logoutApi } from "../api/authApi";

import { refresh } from "../api/authApi";


interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (accessToken: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await refresh();
        localStorage.setItem("accessToken", res.accessToken);
        setIsLoggedIn(true);
      } catch {
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);
  const login = (accessToken: string) => {
    localStorage.setItem("accessToken", accessToken);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch (_) {

    } finally {
      localStorage.removeItem("accessToken");
      setIsLoggedIn(false);
    }
  };


  useEffect(() => {
    const handleLogout = () => {
      localStorage.removeItem("accessToken");
      setIsLoggedIn(false);
    };

    window.addEventListener("auth:logout", handleLogout);
    return () => window.removeEventListener("auth:logout", handleLogout);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
