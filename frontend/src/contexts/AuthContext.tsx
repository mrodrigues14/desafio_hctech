'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginDto } from '@/types';
import { apiService } from '@/services/api';

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginDto) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se há token salvo no localStorage
    const token = localStorage.getItem('auth_token');
    if (token) {
      // Você pode fazer uma verificação adicional aqui se necessário
      // Por enquanto, vamos assumir que o token é válido
      const userData = localStorage.getItem('user_data');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginDto) => {
    try {
      const response = await apiService.login(credentials);
      setUser(response.user);
      localStorage.setItem('user_data', JSON.stringify(response.user));
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    apiService.logout();
    setUser(null);
    localStorage.removeItem('user_data');
  };

  const value = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user,
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
