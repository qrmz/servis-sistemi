// backend/server.js - YEKUN VƏ TAM DÜZGÜN VERSİYA
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { protect } = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

// === CORS KONFİQURASİYASI (YENİLƏNMİŞ) ===
const allowedOrigins = [
  'https://kontakt-service.netlify.app', // Sizin yeni Netlify saytınız
  'http://localhost:3001'                // Sizin lokal frontend-iniz
];

// backend/server.js faylının içində...

// Middleware
const corsOptions = {
  origin: function (origin, callback) {
    // Canlı Netlify ünvanı
    const productionOrigin = 'https://kontakt-service.netlify.app';

    // Əgər mühit 'production' deyilsə (yəni lokal kompüterdirsə),
    // və ya sorğu gələn ünvan bizim canlı saytımızdırsa, icazə ver.
    // Postman kimi 'origin'-i olmayan sorğulara da icazə verilir (!origin).
    if (process.env.NODE_ENV !== 'production' || !origin || origin === productionOrigin) {
      callback(null, true);
    } else {
      callback(new Error('Bu mənbədən girişə CORS tərəfindən icazə verilmir'));
    }
  }
};

app.use(cors(corsOptions));
app.use(express.json());

// ... qalan kod olduğu kimi qalır

// Verilənlər bazasına qoşulma
mongoose.connect(process.env.CONNECTION_STRING)
  .then(() => console.log('Verilənlər bazasına uğurla qoşuldu!'))
  .catch((err) => console.error('Verilənlər bazasına qoşularkən xəta baş verdi:', err));

// Routes
const userRoutes = require('./routes/userRoutes');
const aktRoutes = require('./routes/aktRoutes');

app.use('/api/users', userRoutes);
app.use('/api/akts', protect, aktRoutes);

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda TAM HAZIRDIR!`);
});