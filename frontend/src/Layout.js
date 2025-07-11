// frontend/src/Layout.js
import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

function Layout() {
  const { logout } = useAuth();
  return (
    <div className="App">
      <header className="App-header">
        <h1><Link to="/">Kontakt<span>Plus</span> Servis</Link></h1>
        <nav>
          <Link to="/">Bütün Aktlar</Link>
          <Link to="/yeni-akt">Yeni Akt Yarat</Link>
          <button onClick={logout} className="logout-btn">Çıxış Et</button>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;