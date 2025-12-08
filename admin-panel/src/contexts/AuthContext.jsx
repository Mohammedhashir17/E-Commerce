import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

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
    const token = localStorage.getItem('admin_token');
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/auth/profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
        },
      });
      if (response.data.role === 'admin') {
        setUser(response.data);
      } else {
        localStorage.removeItem('admin_token');
        setUser(null);
      }
    } catch (error) {
      localStorage.removeItem('admin_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await axios.post('http://localhost:5000/api/v1/auth/login', {
      email,
      password,
    });
    
    if (response.data.role !== 'admin') {
      throw new Error('Access denied. Admin privileges required.');
    }
    
    localStorage.setItem('admin_token', response.data.token);
    setUser(response.data);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

