// frontend/src/HomePage.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  const [aktlar, setAktlar] = useState([]);
  const statusOptions = ["sistemə-gözləyir", "sistemə-işlənib", "göndərilib", "gəlib", "təslim-edilib"];

  const fetchAktlar = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/akts');
      const data = await response.json();
      setAktlar(data);
    } catch (error) {
      console.error("Aktları alarkən xəta baş verdi:", error);
    }
  };

  useEffect(() => {
    fetchAktlar();
  }, []);

  const handleStatusChange = async (id, yeniStatus) => {
    try {
      const response = await fetch(`http://localhost:3000/api/akts/${id}`, {
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
        const response = await fetch(`http://localhost:3000/api/akts/${id}`, {
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
      <table>
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
                  // --- YENİ DƏYİŞİKLİK BURADADIR ---
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