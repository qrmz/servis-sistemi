import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'; // <-- Outlet və Navigate bura əlavə edildi
import HomePage from './HomePage';
import YeniAktPage from './YeniAktPage';
import AktViewPage from './AktViewPage';
import LoginPage from './LoginPage';
import Layout from './Layout';
import { useAuth } from './context/AuthContext';
import './App.css'; 

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  // ProtectedRoute-un içində artıq Layout yox, Outlet istifadə olunur
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  const { isAuthenticated } = useAuth();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} />
        
        {/* Bütün qorunan səhifələr Layout-un içindədir */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="yeni-akt" element={<YeniAktPage />} />
            <Route path="akt/:id" element={<AktViewPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;