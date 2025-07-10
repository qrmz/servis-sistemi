import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function YeniAktPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    musteri: '', elaqe: '', faktura: '', mehsul: '', seriya: '',
    xarici: '', zemanet: 'Rəsmi', komplekt: '', sebep: '',
    ekspert: '', veren: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://kontaktplus-servis.onrender.com/api/akts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Serverdən gələn xəta:', errorData);
        throw new Error('Akt yaradılarkən xəta baş verdi');
      }
      const yeniAkt = await response.json();
      navigate(`/akt/${yeniAkt._id}`); 
    } catch (error) {
      console.error("Forma göndərilərkən xəta:", error);
    }
  };

  return (
    <div>
      <h2>Yeni Akt Yarat</h2>
      <form onSubmit={handleSubmit}>
        <label>Müştəri Adı:</label>
        <input name="musteri" value={formData.musteri} onChange={handleChange} required />
        <label>Əlaqə Nömrəsi:</label>
        <input name="elaqe" value={formData.elaqe} onChange={handleChange} required />
        <label>Faktura Nömrəsi:</label>
        <input name="faktura" value={formData.faktura} onChange={handleChange} required />
        <label>Məhsulun Adı:</label>
        <input name="mehsul" value={formData.mehsul} onChange={handleChange} required />
        <label>Seriya Nömrəsi:</label>
        <input name="seriya" value={formData.seriya} onChange={handleChange} required />
        <label>Xarici Görünüş:</label>
        <input name="xarici" value={formData.xarici} onChange={handleChange} />
        <label>Zəmanətin Növü:</label>
        <select name="zemanet" value={formData.zemanet} onChange={handleChange}>
            <option value="Rəsmi">Rəsmi</option>
            <option value="Qızıl Zəmanət Ultra">Qızıl Zəmanət Ultra</option>
            <option value="Zəmanət+">Zəmanət+</option>
            <option value="Yoxdur">Zəmanət müddəti bitib</option>
        </select>
        <label>Komplektasiya:</label>
        <textarea name="komplekt" value={formData.komplekt} onChange={handleChange} rows="2"></textarea>
        <label>Göndərilmə Səbəbi:</label>
        <textarea name="sebeb" value={formData.sebeb} onChange={handleChange} rows="3" required></textarea>
        <label>Təhvil Alan Ekspert:</label>
        <input name="ekspert" value={formData.ekspert} onChange={handleChange} required />
        <label>Təhvil Verən Şəxs:</label>
        <input name="veren" value={formData.veren} onChange={handleChange} required />
        <button type="submit">Aktı Yarat və Çap Et</button>
      </form>
    </div>
  );
}

export default YeniAktPage;