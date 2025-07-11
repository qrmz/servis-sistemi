// frontend/src/HomePage.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  const [aktlar, setAktlar] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const statusOptions = ["sistemə-gözləyir", "sistemə-işlənib", "göndərilib", "gəlib", "təslim-edilib"];

  const fetchAktlar = async (query = '') => {
    try {
      const response = await fetch(`https://kontaktplus-servis.onrender.com/api/akts?${query}`);
      const data = await response.json();
      setAktlar(data);
    } catch (error) {
      console.error("Aktları alarkən xəta baş verdi:", error);
    }
  };

  useEffect(() => {
    fetchAktlar(); // Səhifə ilk dəfə açılanda bütün aktları yükləyir
  }, []);

  const handleFilter = () => {
    const queryParams = new URLSearchParams({
        startDate,
        endDate,
        searchTerm
    }).toString();
    fetchAktlar(queryParams);
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setSearchTerm('');
    fetchAktlar(); // Bütün filterləri təmizləyib yenidən hamısını yükləyir
  };

  // ... handleStatusChange və handleDelete funksiyaları olduğu kimi qalır ...
  const handleStatusChange = async (id, yeniStatus) => {
    try {
      const response = await fetch(`https://kontaktplus-servis.onrender.com/api/akts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: yeniStatus }),
      });
      if (!response.ok) throw new Error('Status yenilənərkən xəta baş verdi');
      const yenilenmisAkt = await response.json();
      setAktlar(aktlar.map(akt => (akt._id === id ? yenilenmisAkt : akt)));
    } catch (error) {
      console.error("Status yenilənərkən xəta:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bu aktı silmək istədiyinizə əminsinizmi?")) {
      try {
        const response = await fetch(`https://kontaktplus-servis.onrender.com/api/akts/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Akt silinərkən xəta baş verdi');
        setAktlar(aktlar.filter(akt => akt._id !== id));
      } catch (error) {
        console.error("Akt silinərkən xəta:", error);
      }
    }
  };


  return (
    <div>
      <h2>Bütün Aktların Siyahısı</h2>

      {/* --- YENİ HİSSƏ: FİLTER VƏ AXTARIŞ --- */}
      <div className="filter-container">
        <input 
            type="text" 
            placeholder="Axtar (Müştəri, Məhsul, Seriya...)"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="search-input"
        />
        <div className="date-filters">
            <label>Başlanğıc Tarix:</label>
            <input 
                type="date" 
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
            />
            <label>Son Tarix:</label>
            <input 
                type="date" 
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
            />
        </div>
        <div className="filter-buttons">
            <button onClick={handleFilter} className="main-btn">Filterlə</button>
            <button onClick={handleReset} className="secondary-btn">Təmizlə</button>
        </div>
      </div>
      <p className="results-count"><strong>Nəticə: {aktlar.length} akt tapıldı</strong></p>


      <table>
        {/* ... cədvəl olduğu kimi qalır ... */}
        <thead>
          <tr>
            <th>Müştəri</th>
            <th>Məhsul</th>
            <th>Seriya Nömrəsi</th>
            <th>Status</th>
            <th>Əməliyyatlar</th>
          </tr>
        </thead>
        <tbody>
          {aktlar.map(akt => (
            <tr key={akt._id}>
              <td>{akt.musteri}</td>
              <td>{akt.mehsul}</td>
              <td>{akt.seriya}</td>
              <td>
                <select
                  className={`status-select ${akt.status}`}
                  value={akt.status}
                  onChange={(e) => handleStatusChange(akt._id, e.target.value)}
                >
                  {statusOptions.map(option => (
                    <option key={option} value={option}>
                      {option.replace(/-/g, ' ').toUpperCase()}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <Link to={`/akt/${akt._id}`} className="action-btn print-btn">Çap Et</Link>
                <button onClick={() => handleDelete(akt._id)} className="action-btn delete-btn">
                  Sil
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HomePage;