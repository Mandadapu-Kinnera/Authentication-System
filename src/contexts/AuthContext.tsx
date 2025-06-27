import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = 'http://localhost:3001/api';

axios.defaults.baseURL = API_BASE_URL;

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchCurrentUser();
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get('/auth/me');
      if (response.data.success) {
        setUser(response.data.data.user);
      }
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('/auth/login', { email, password });
      if (response.data.success) {
        const { token: newToken, user: newUser } = response.data.data;
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('token', newToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      }
    } catch (error: any) {
      const message = error.response?.data?.error || 'Login failed';
      throw new Error(message);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const response = await axios.post('/auth/signup', { name, email, password });
      if (response.data.success) {
        const { token: newToken, user: newUser } = response.data.data;
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('token', newToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      }
    } catch (error: any) {
      const message = error.response?.data?.error || 'Signup failed';
      throw new Error(message);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await axios.post('/auth/reset-password', { email });
    } catch (error: any) {
      const message = error.response?.data?.error || 'Password reset failed';
      throw new Error(message);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    token,
    isLoading,
    login,
    signup,
    logout,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};