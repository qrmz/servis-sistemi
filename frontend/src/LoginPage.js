import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import './LoginPage.css';
import loginBg from './login-bg.jpg';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch(`${API_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login zamanı xəta baş verdi');
      login(data.token);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-page-wrapper" style={{ backgroundImage: `url(${loginBg})` }}>
      <div className="login-box">
        <div className="login-logo"><h1>Kontakt<span>Plus</span></h1></div>
        <form onSubmit={handleSubmit}>
          <h2>Sistemə Daxil Ol</h2>
          {error && <p className="error-message">{error}</p>}
          <label>İstifadəçi Adı:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <label>Şifrə:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">Daxil Ol</button>
        </form>
      </div>
      <footer>by Qurban Qırmızı</footer>
    </div>
  );
}
export default LoginPage;