import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

function AktViewPage() {
  const [akt, setAkt] = useState(null);
  const { id } = useParams();
  const { token } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const fetchAkt = async () => {
      if (!id || !token) return;
      try {
        const response = await fetch(`${API_URL}/api/akts/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Akt tapılmadı və ya icazə yoxdur');
        const data = await response.json();
        setAkt(data);
      } catch (error) {
        console.error("Akt məlumatı alarkən xəta:", error);
      }
    };
    
    if (location.state && location.state.akt) {
      setAkt(location.state.akt);
    } else {
      fetchAkt();
    }
  }, [id, token, location.state, API_URL]);

  if (!akt) { return <div style={{padding: '20px'}}>Yüklənir...</div>; }

  return (
    <div className="print-container">
      <h1>Servisə göndərilmə sənədi</h1>
      <p><strong>Tarix:</strong> {new Date(akt.tarix).toLocaleDateString()}</p><hr/>
      <p><strong>Müştəri Adı:</strong> {akt.musteri}</p>
      <p><strong>Əlaqə Nömrəsi:</strong> {akt.elaqe}</p>
      <p><strong>Faktura Nömrəsi:</strong> {akt.faktura}</p>
      <p><strong>Məhsulun Adı:</strong> {akt.mehsul}</p>
      <p><strong>Seriya Nömrəsi:</strong> {akt.seriya}</p>
      <p><strong>Xarici Görünüş:</strong> {akt.xarici}</p>
      <p><strong>Zəmanət Növü:</strong> {akt.zemanet}</p>
      <p><strong>Komplektasiya:</strong> {akt.komplekt}</p>
      <p><strong>Göndərilmə Səbəbi:</strong> {akt.sebeb}</p><hr/>
      <div className="signature-section">
          <div className="signature-box">
              <div className="signature-name">Təhvil Alan: {akt.ekspert}</div><div className="signature-line"></div>
          </div>
          <div className="signature-box">
              <div className="signature-name">Təhvil Verən: {akt.veren}</div><div className="signature-line"></div>
          </div>
      </div>
      <button onClick={() => window.print()}>Çap Et</button>
    </div>
  );
}
export default AktViewPage;