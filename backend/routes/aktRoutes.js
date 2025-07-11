// backend/routes/aktRoutes.js
const express = require('express');
const router = express.Router();
const Akt = require('../models/Akt');

router.post('/', async (req, res) => {
  try {
    const yeniAkt = new Akt(req.body);
    await yeniAkt.save();
    res.status(201).send(yeniAkt);
  } catch (err) {
    res.status(400).send({ message: "Məlumatları yadda saxlayarkən xəta baş verdi", error: err.message });
  }
});

router.get('/', async (req, res) => {
    try {
        const { startDate, endDate, searchTerm } = req.query;
        const filter = {};
        if (startDate && endDate) {
            filter.tarix = { $gte: new Date(startDate), $lte: new Date(endDate) };
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
        res.status(500).send({ message: "Məlumatları alarkən xəta baş verdi", error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const akt = await Akt.findById(req.params.id);
        if (!akt) return res.status(404).send({ message: "Akt tapılmadı" });
        res.status(200).send(akt);
    } catch (err) {
        res.status(500).send({ message: "Akt məlumatını alarkən xəta baş verdi", error: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const yenilenmisAkt = await Akt.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!yenilenmisAkt) return res.status(404).send({ message: "Akt tapılmadı" });
        res.status(200).send(yenilenmisAkt);
    } catch (err) {
        res.status(500).send({ message: "Aktı yeniləyərkən xəta baş verdi", error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const silinmisAkt = await Akt.findByIdAndDelete(req.params.id);
        if (!silinmisAkt) return res.status(404).send({ message: "Akt tapılmadı" });
        res.status(200).send({ message: "Akt uğurla silindi" });
    } catch (err) {
        res.status(500).send({ message: "Aktı silərkən xəta baş verdi", error: err.message });
    }
});

module.exports = router;