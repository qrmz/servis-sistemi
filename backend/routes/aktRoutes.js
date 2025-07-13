// backend/routes/aktRoutes.js - TAM VƏ DÜZGÜN VERSİYA
const express = require('express');
const router = express.Router();
const Akt = require('../models/Akt');

// BÜTÜN AKTLARI GƏTİR (GET)
router.get('/', async (req, res) => {
    try {
        let filter = {};
        if (req.user && req.user.role !== 'admin') {
            filter.storeName = req.user.storeName;
        }

        const { startDate, endDate, searchTerm } = req.query;
        if (startDate && endDate) {
            filter.tarix = { $gte: new Date(startDate), $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)) };
        }
        if (searchTerm) {
            const regex = new RegExp(searchTerm, 'i');
            filter.$or = [
                { musteri: regex }, { mehsul: regex }, { seriya: regex },
                { faktura: regex }, { sebeb: regex }, { ekspert: regex }
            ];
        }
        const aktlar = await Akt.find(filter).sort({ tarix: -1 });
        res.status(200).send(aktlar);
    } catch (err) {
        res.status(500).send({ message: "Məlumatları alarkən xəta baş verdi" });
    }
});

// YENİ AKT YARAT (POST)
router.post('/', async (req, res) => {
  try {
    const yeniAkt = new Akt({ 
      ...req.body, 
      storeName: req.user.storeName 
    });
    await yeniAkt.save();
    res.status(201).send(yeniAkt);
  } catch (err) {
    res.status(400).send({ message: "Məlumatları yadda saxlayarkən xəta baş verdi", error: err.message });
  }
});

// TƏK BİR AKTI ID İLƏ GƏTİR (GET /:id) - ƏSAS DÜZƏLİŞ BURADADIR
router.get('/:id', async (req, res) => {
    try {
        const akt = await Akt.findById(req.params.id);
        if (!akt) {
            return res.status(404).send({ message: "Akt tapılmadı" });
        }
        if (req.user.role !== 'admin' && akt.storeName !== req.user.storeName) {
            return res.status(403).json({ message: 'Bu əməliyyat üçün icazəniz yoxdur' });
        }
        res.status(200).send(akt);
    } catch (err) {
        res.status(500).send({ message: "Akt məlumatını alarkən xəta baş verdi" });
    }
});

// AKTI YENİLƏ (PUT)
router.put('/:id', async (req, res) => {
    if (req.user.role === 'admin') {
        return res.status(403).json({ message: 'Admin istifadəçilər məlumatları dəyişə bilməz' });
    }
    try {
        const yenilenmisAkt = await Akt.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!yenilenmisAkt) return res.status(404).send({ message: "Akt tapılmadı" });
        res.status(200).send(yenilenmisAkt);
    } catch (err) {
        res.status(500).send({ message: "Aktı yeniləyərkən xəta baş verdi" });
    }
});

// AKTI SİL (DELETE)
router.delete('/:id', async (req, res) => {
    if (req.user.role === 'admin') {
        return res.status(403).json({ message: 'Admin istifadəçilər məlumatları silə bilməz' });
    }
    try {
        const silinmisAkt = await Akt.findByIdAndDelete(req.params.id);
        if (!silinmisAkt) return res.status(404).send({ message: "Akt tapılmadı" });
        res.status(200).send({ message: "Akt uğurla silindi" });
    } catch (err) {
        res.status(500).send({ message: "Aktı silərkən xəta baş verdi" });
    }
});

module.exports = router;