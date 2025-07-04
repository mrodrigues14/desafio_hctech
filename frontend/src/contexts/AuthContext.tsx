'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, LoginDto } from '@/types';
import { apiService } from '@/services/api';

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginDto) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    apiService.logout();
    setUser(null);
    localStorage.removeItem('user_data');
    localStorage.removeItem('login_time');
  }, []);

  useEffect(() => {
    checkSession();
  }, []); 

  useEffect(() => {
    if (!user) return;

    const sessionCheckInterval = setInterval(() => {
      const loginTime = localStorage.getItem('login_time');
      if (loginTime) {
        const now = new Date().getTime();
        const sessionTime = parseInt(loginTime);
        const oneHour = 60 * 60 * 1000;
        const timeElapsed = now - sessionTime;

        if (timeElapsed > 50 * 60 * 1000 && timeElapsed <= 55 * 60 * 1000) {
          alert('Sua sessão expirará em 10 minutos. Salve seu trabalho!');
        }

        if (timeElapsed > oneHour) {
          logout();
          alert('Sua sessão expirou. Faça login novamente.');
        }
      }
    }, 5 * 60 * 1000); 

    return () => clearInterval(sessionCheckInterval);
  }, [user?.id, logout]);
  const checkSession = () => {
    const shouldClearSession = !sessionStorage.getItem('session_initialized');
    
    if (shouldClearSession) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      localStorage.removeItem('login_time');
      sessionStorage.setItem('session_initialized', 'true');
      setIsLoading(false);
      return;
    }

    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    const loginTime = localStorage.getItem('login_time');

    if (token && userData && loginTime) {
      const now = new Date().getTime();
      const sessionTime = parseInt(loginTime);
      const oneHour = 60 * 60 * 1000; 

      if (now - sessionTime > oneHour) {
        logout();
      } else {
        setUser(JSON.parse(userData));
      }
    }
    setIsLoading(false);
  };

  const login = async (credentials: LoginDto) => {
    try {
      const response = await apiService.login(credentials);
      console.log('Login response:', response); // Debug log
      setUser(response.user);
      localStorage.setItem('user_data', JSON.stringify(response.user));
      localStorage.setItem('login_time', new Date().getTime().toString());
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
