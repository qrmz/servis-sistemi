import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

function HomePage() {
  const [aktlar, setAktlar] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { token, user, logout } = useAuth();
  const statusOptions = ["sistemə-gözləyir", "sistemə-işlənib", "göndərilib", "gəlib", "təslim-edilib"];

  const fetchAktlar = useCallback(async (query = '') => {
    if (!token) return;
    try {
      const response = await fetch(`${API_URL}/api/akts?${query}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.status === 401) { logout(); return; }
      if (!response.ok) throw new Error('Məlumatları alarkən problem yarandı');
      const data = await response.json();
      setAktlar(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Aktları alarkən xəta baş verdi:", error);
      setAktlar([]);
    }
  }, [token, logout]);

  useEffect(() => {
    fetchAktlar();
  }, [fetchAktlar]);

  const handleFilter = () => {
    const queryParams = new URLSearchParams({ startDate, endDate, searchTerm }).toString();
    fetchAktlar(queryParams);
  };

  const handleReset = () => {
    setStartDate(''); setEndDate(''); setSearchTerm('');
    fetchAktlar();
  };

  const handleStatusChange = async (id, yeniStatus) => {
    if (user && user.role === 'admin') { alert('Admin statusu dəyişə bilməz.'); return; }
    try {
      await fetch(`${API_URL}/api/akts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: yeniStatus }),
      });
      fetchAktlar();
    } catch (error) { console.error("Status yenilənərkən xəta:", error); }
  };

  const handleDelete = async (id) => {
    if (user && user.role === 'admin') { alert('Admin aktı silə bilməz.'); return; }
    if (window.confirm("Bu aktı silmək istədiyinizə əminsinizmi?")) {
      try {
        await fetch(`${API_URL}/api/akts/${id}`, { 
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        setAktlar(aktlar.filter(akt => akt._id !== id));
      } catch (error) { console.error("Akt silinərkən xəta:", error); }
    }
  };

  return (
    <div>
      <h2>Bütün Aktların Siyahısı</h2>
      <div className="filter-container">
        <input type="text" placeholder="Axtar (Müştəri, Məhsul, Seriya...)" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="search-input" />
        <div className="date-filters">
            <label>Başlanğıc Tarix:</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            <label>Son Tarix:</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </div>
        <div className="filter-buttons">
            <button onClick={handleFilter} className="main-btn">Filterlə</button>
            <button onClick={handleReset} className="secondary-btn">Təmizlə</button>
        </div>
      </div>

      <p className="results-count"><strong>Nəticə: {aktlar.length} akt tapıldı</strong></p>
      <div className="table-container">
        <table>
        <thead>
          <tr><th>Müştəri</th><th>Məhsul</th><th>Seriya Nömrəsi</th><th>Status</th><th>Əməliyyatlar</th></tr>
        </thead>
        <tbody>
          {aktlar.map(akt => (
            <tr key={akt._id}>
              <td>{akt.musteri}</td>
              <td>{akt.mehsul}</td>
              <td>{akt.seriya}</td>
              <td>
                <select className={`status-select ${akt.status}`} value={akt.status} onChange={(e) => handleStatusChange(akt._id, e.target.value)} disabled={user && user.role === 'admin'}>
                  {statusOptions.map(option => (<option key={option} value={option}>{option.replace(/-/g, ' ').toUpperCase()}</option>))}
                </select>
              </td>
              <td>
                <Link to={`/akt/${akt._id}`} className="action-btn print-btn">Çap Et</Link>
                <button onClick={() => handleDelete(akt._id)} className="action-btn delete-btn" disabled={user && user.role === 'admin'}>Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

export default HomePage;