// frontend/src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [userToken, setUserToken] = useState(localStorage.getItem('token'));

  const login = (token) => {
    localStorage.setItem('token', token);
    setUserToken(token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUserToken(null);
  };

  const authInfo = {
    token: userToken,
    login,
    logout,
    isAuthenticated: !!userToken, // Token varsa, true, yoxdursa false qaytarır
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
}

// Bu, digər komponentlərdə auth məlumatlarını asanlıqla almaq üçün bir custom hook-dur
export const useAuth = () => {
  return useContext(AuthContext);
};