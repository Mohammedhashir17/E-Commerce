import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getUserProfile } from '../services/backend-service';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const userData = await getUserProfile();
      setUser(userData);
    } catch (error) {
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    const userData = await loginUser(credentials);
    localStorage.setItem('token', userData.token);
    // Set user immediately with the data from login response
    setUser({
      _id: userData._id,
      name: userData.name,
      email: userData.email,
    });
    return userData;
  };

  const register = async (userData) => {
    const response = await registerUser(userData);
    localStorage.setItem('token', response.token);
    // Set user immediately with the data from register response
    setUser({
      _id: response._id,
      name: response.name,
      email: response.email,
    });
    return response;
  };

  const setUserFromToken = async (userData) => {
    // Helper function to set user from OTP login/register
    setUser({
      _id: userData._id,
      name: userData.name,
      email: userData.email,
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('cart');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, setUserFromToken }}>
      {children}
    </AuthContext.Provider>
  );
};

