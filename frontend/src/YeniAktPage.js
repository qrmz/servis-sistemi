// frontend/src/YeniAktPage.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function YeniAktPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false); // Düymənin basılıb-basılmadığını yoxlamaq üçün

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
    setIsSubmitting(true); // Göndərmə prosesi başladı
    console.log("1. handleSubmit funksiyası işə düşdü.");

    try {
      console.log("2. Backend-ə sorğu göndərilir:", JSON.stringify(formData));
      const response = await fetch('https://kontaktplus-servis.onrender.com/api/akts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      console.log("3. Backend-dən cavab gəldi. Status:", response.status);
      if (!response.ok) {
        const errorData = await response.json();
        console.error('4. Serverdən xəta cavabı:', errorData);
        throw new Error('Akt yaradılarkən server xətası baş verdi');
      }
      
      const yeniAkt = await response.json();
      console.log("5. Yeni akt uğurla yaradıldı, ID:", yeniAkt._id);
      
      console.log("6. Çap səhifəsinə yönləndirilir...");
      navigate(`/akt/${yeniAkt._id}`); 

    } catch (error) {
      console.error("7. Prosesdə ümumi xəta baş verdi:", error);
      setIsSubmitting(false); // Xəta baş verərsə düyməni yenidən aktivləşdir
    }
  };

  return (
    <div>
      <h2>Yeni Akt Yarat</h2>
      <form onSubmit={handleSubmit}>
        {/* Bütün input, select, textarea sahələri olduğu kimi qalır... */}
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
        
        {/* Düyməni proses zamanı qeyri-aktiv edirik */}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Göndərilir...' : 'Aktı Yarat və Çap Et'}
        </button>
      </form>
    </div>
  );
}

export default YeniAktPage;