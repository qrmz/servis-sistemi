const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// YENİ ŞİFRƏ İLƏ DÜZƏLİŞ EDİLMİŞ QOŞULMA SƏTRİ
const CONNECTION_STRING = 'mongodb+srv://servis-user:Kontakt2025@cluster0.wyamdcj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(CONNECTION_STRING)
  .then(() => {
    console.log('Verilənlər bazasına uğurla qoşuldu!');
  })
  .catch((err) => {
    console.error('Verilənlər bazasına qoşularkən xəta baş verdi:', err);
  });

const aktSchema = new mongoose.Schema({
  musteri: { type: String, required: true },
  elaqe: { type: String, required: true },
  faktura: { type: String, required: true },
  mehsul: { type: String, required: true },
  seriya: { type: String, required: true },
  xarici: String,
  zemanet: String,
  komplekt: String,
  sebeb: { type: String, required: true },
  ekspert: { type: String, required: true },
  veren: { type: String, required: true },
  status: { type: String, default: 'sistemə-gözləyir' },
  tarix: { type: Date, default: Date.now }
});

const Akt = mongoose.model('Akt', aktSchema);

// === API Endpoints ===

app.post('/api/akts', async (req, res) => {
  try {
    const yeniAkt = new Akt(req.body);
    await yeniAkt.save();
    res.status(201).send(yeniAkt);
  } catch (err) {
    res.status(400).send({ message: "Məlumatları yadda saxlayarkən xəta baş verdi", error: err.message });
  }
});

app.get('/api/akts', async (req, res) => {
    try {
        const aktlar = await Akt.find().sort({ tarix: -1 });
        res.status(200).send(aktlar);
    } catch (err) {
        res.status(500).send({ message: "Məlumatları alarkən xəta baş verdi", error: err.message });
    }
});

app.get('/api/akts/:id', async (req, res) => {
    try {
        const akt = await Akt.findById(req.params.id);
        if (!akt) {
            return res.status(404).send({ message: "Akt tapılmadı" });
        }
        res.status(200).send(akt);
    } catch (err) {
        res.status(500).send({ message: "Akt məlumatını alarkən xəta baş verdi", error: err.message });
    }
});

app.put('/api/akts/:id', async (req, res) => {
    try {
        const yenilenmisAkt = await Akt.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!yenilenmisAkt) {
            return res.status(404).send({ message: "Akt tapılmadı" });
        }
        res.status(200).send(yenilenmisAkt);
    } catch (err) {
        res.status(500).send({ message: "Aktı yeniləyərkən xəta baş verdi", error: err.message });
    }
});

app.delete('/api/akts/:id', async (req, res) => {
    try {
        const silinmisAkt = await Akt.findByIdAndDelete(req.params.id);
        if (!silinmisAkt) {
            return res.status(404).send({ message: "Akt tapılmadı" });
        }
        res.status(200).send({ message: "Akt uğurla silindi" });
    } catch (err) {
        res.status(500).send({ message: "Aktı silərkən xəta baş verdi", error: err.message });
    }
});

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda işə düşdü`);
});