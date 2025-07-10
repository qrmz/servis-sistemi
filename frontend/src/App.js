// frontend/src/App.js

import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// --- DÜZƏLİŞ EDİLMİŞ HİSSƏ ---
// Faylları yeni, düzgün adları ilə çağırırıq
import HomePage from './HomePage'; 
import YeniAktPage from './YeniAktPage';
import AktViewPage from './AktViewPage';
// -----------------------------

import './App.css'; 

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          {/* Linkin içindəki başlığa basdıqda Əsas Səhifəyə getməsini təmin edirik */}
          <h1><Link to="/">Kontakt<span>Plus</span> Servis</Link></h1>
          <nav>
            <Link to="/">Bütün Aktlar</Link>
            <Link to="/yeni-akt">Yeni Akt Yarat</Link>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/yeni-akt" element={<YeniAktPage />} />
            <Route path="/akt/:id" element={<AktViewPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;