import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get('/customers/me');
      if (res.data.success && res.data.customer) {
        setCustomer(res.data.customer);
      }
    } catch (err) {
      setCustomer(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const login = async (email, password) => {
    setAuthError(null);
    try {
      const res = await api.post('/customers/login', { email, password });
      if (res.data.success) {
        if (res.data.token) {
          localStorage.setItem('shopkart_token', res.data.token);
        }
        setCustomer(res.data.customer);
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check credentials.';
      setAuthError(msg);
      return { success: false, message: msg };
    }
  };

  const register = async (name, email, password, phone, address) => {
    setAuthError(null);
    try {
      const res = await api.post('/customers/register', {
        name,
        email,
        password,
        phone,
        address
      });
      if (res.data.success) {
        if (res.data.token) {
          localStorage.setItem('shopkart_token', res.data.token);
        }
        setCustomer(res.data.customer);
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
      setAuthError(msg);
      return { success: false, message: msg };
    }
  };

  const logout = async () => {
    try {
      await api.post('/customers/logout');
    } catch (e) {
      // Continue cleanup regardless
    }
    localStorage.removeItem('shopkart_token');
    setCustomer(null);
  };

  return (
    <AuthContext.Provider
      value={{
        customer,
        isAuthenticated: !!customer,
        loading,
        authError,
        setAuthError,
        login,
        register,
        logout,
        fetchProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
