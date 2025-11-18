// client/src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { login as apiLogin, signup as apiSignup } from '../api/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user data from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('userId');
    const teacherId = localStorage.getItem('teacherId'); // For student role
    
    if (token && role && userId) {
      setUser({ token, role, userId, teacherId });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { token, role, userId, teacherId } = await apiLogin({ email, password });
      
      // Securely persist auth token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('userId', userId);
      if (teacherId) localStorage.setItem('teacherId', teacherId);
      
      setUser({ token, role, userId, teacherId });
      return { success: true };
    } catch (error) {
      console.error("Login Error:", error.message);
      return { success: false, message: error.message };
    }
  };

  const signup = async (userData) => {
    try {
      await apiSignup(userData);
      return { success: true };
    } catch (error) {
      console.error("Signup Error:", error.message);
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    // Clear persisted data
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('teacherId');
    setUser(null);
  };

  const value = { user, loading, login, signup, logout };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
