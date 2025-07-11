// frontend/src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './HomePage';
import YeniAktPage from './YeniAktPage';
import AktViewPage from './AktViewPage';
import LoginPage from './LoginPage';
import Layout from './Layout';
import { useAuth } from './context/AuthContext'; // AuthContext-i bura da import edirik
import './App.css'; 

// İstifadəçinin daxil olub-olmadığını yoxlayan xüsusi bir komponent
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    // Əgər daxil olmayıbsa, login səhifəsinə yönləndirir
    return <Navigate to="/login" />;
  }
  return children;
}

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Əgər istifadəçi daxil olubsa və /login səhifəsinə getməyə çalışırsa, onu ana səhifəyə yönləndir */}
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} />
        
        {/* Əsas səhifələr qorunan bir Route içindədir */}
        <Route 
          path="/*" 
          element={
            <ProtectedRoute>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<HomePage />} />
                  <Route path="yeni-akt" element={<YeniAktPage />} />
                  <Route path="akt/:id" element={<AktViewPage />} />
                </Route>
              </Routes>
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;