const express = require('express');
const router = express.Router();
const Akt = require('../models/Akt');

// Bütün aktları gətir
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
            filter.$or = [ { musteri: regex }, { mehsul: regex }, { seriya: regex }, { faktura: regex } ];
        }
        const aktlar = await Akt.find(filter).sort({ tarix: -1 });
        res.status(200).send(aktlar);
    } catch (err) {
        res.status(500).send({ message: "Məlumatları alarkən xəta baş verdi" });
    }
});

// Tək bir aktı ID ilə gətir
router.get('/:id', async (req, res) => {
    try {
        const akt = await Akt.findById(req.params.id);
        if (!akt) return res.status(404).send({ message: "Akt tapılmadı" });
        if (req.user.role !== 'admin' && akt.storeName !== req.user.storeName) {
            return res.status(403).json({ message: 'Bu əməliyyat üçün icazəniz yoxdur' });
        }
        res.status(200).send(akt);
    } catch (err) {
        res.status(500).send({ message: "Akt məlumatını alarkən xəta baş verdi" });
    }
});
// ... (POST, PUT, DELETE metodları dəyişməz qalır)
module.exports = router;