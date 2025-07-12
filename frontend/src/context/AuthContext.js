// frontend/src/context/AuthContext.js - SON DÜZƏLİŞ

import React, { createContext, useState, useContext } from 'react'; // useEffect buradan silindi
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('token'));

  const login = (token) => {
    localStorage.setItem('token', token);
    setAuthToken(token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
  };

  let user = null;
  if (authToken) {
    try {
      user = jwtDecode(authToken);
    } catch (e) {
      console.error("Invalid token:", e);
      logout();
    }
  }

  const authInfo = {
    token: authToken,
    user,
    login,
    logout,
    isAuthenticated: !!authToken,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};