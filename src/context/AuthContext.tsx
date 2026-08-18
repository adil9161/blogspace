import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User } from '../types';
import { AuthService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  loginAsDemo: () => void;
  register: (params: {
    name: string;
    username: string;
    email: string;
    password?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updatedData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedUser = AuthService.getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password?: string) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 350));
    const result = AuthService.login(email, password);
    setIsLoading(false);

    if (result.success && result.user) {
      setUser(result.user);
      return { success: true };
    }
    return { success: false, error: result.error || 'Login failed. Please try again.' };
  }, []);

  const loginAsDemo = useCallback(() => {
    setIsLoading(true);
    const demo = AuthService.loginAsDemo();
    setUser(demo);
    setIsLoading(false);
  }, []);

  const register = useCallback(
    async (params: { name: string; username: string; email: string; password?: string }) => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 400));
      const result = AuthService.register(params);
      setIsLoading(false);

      if (result.success && result.user) {
        setUser(result.user);
        return { success: true };
      }
      return { success: false, error: result.error || 'Registration failed. Please try again.' };
    },
    []
  );

  const logout = useCallback(() => {
    AuthService.logout();
    setUser(null);
  }, []);

  const updateProfile = useCallback((updatedData: Partial<User>) => {
    const updated = AuthService.updateProfile(updatedData);
    if (updated) {
      setUser(updated);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginAsDemo,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
