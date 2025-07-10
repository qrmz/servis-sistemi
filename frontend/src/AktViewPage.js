import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function AktViewPage() {
  const [akt, setAkt] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchAkt = async () => {
      try {
        const response = await fetch(`https://kontaktplus-servis.onrender.com/api/akts/${id}`);
        if (!response.ok) throw new Error('Akt tapılmadı');
        const data = await response.json();
        setAkt(data);
      } catch (error) {
        console.error("Akt məlumatı alarkən xəta:", error);
      }
    };
    if (id) fetchAkt();
  }, [id]);

  if (!akt) {
    return <div>Yüklənir...</div>;
  }

  return (
    <div className="print-container">
      <h1>Servisə göndərilmə sənədi</h1>
      <p><strong>Tarix:</strong> {new Date(akt.tarix).toLocaleDateString()}</p>
      <hr/>
      <p><strong>Müştəri Adı:</strong> {akt.musteri}</p>
      <p><strong>Əlaqə Nömrəsi:</strong> {akt.elaqe}</p>
      <p><strong>Faktura Nömrəsi:</strong> {akt.faktura}</p>
      <p><strong>Məhsulun Adı:</strong> {akt.mehsul}</p>
      <p><strong>Seriya Nömrəsi:</strong> {akt.seriya}</p>
      <p><strong>Xarici Görünüş:</strong> {akt.xarici}</p>
      <p><strong>Zəmanət Növü:</strong> {akt.zemanet}</p>
      <p><strong>Komplektasiya:</strong> {akt.komplekt}</p>
      <p><strong>Göndərilmə Səbəbi:</strong> {akt.sebeb}</p>
      <hr/>
      <div className="signature-section">
        <div className="signature-box">
          <div className="signature-name">Təhvil Alan: {akt.ekspert}</div>
          <div className="signature-line"></div>
        </div>
        <div className="signature-box">
          <div className="signature-name">Təhvil Verən: {akt.veren}</div>
          <div className="signature-line"></div>
        </div>
      </div>
      <button onClick={() => window.print()}>Çap Et</button>
    </div>
  );
}

export default AktViewPage;