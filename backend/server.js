require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { protect } = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

// === CORS KONFİQURASİYASI ===
// Canlı və lokal mühitlərdən gələn sorğulara icazə veririk
const allowedOrigins = [
  'https://kontakt-service.netlify.app',
  'http://localhost:3001'
];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS tərəfindən icazə verilməyən mənbə'));
    }
  }
};
app.use(cors(corsOptions));
app.use(express.json());

// === DATABASE CONNECTION ===
mongoose.connect(process.env.CONNECTION_STRING)
  .then(() => console.log('Verilənlər bazasına uğurla qoşuldu!'))
  .catch((err) => console.error('Verilənlər bazasına qoşularkən xəta baş verdi:', err));

// === ROUTES ===
const userRoutes = require('./routes/userRoutes');
const aktRoutes = require('./routes/aktRoutes');

app.use('/api/users', userRoutes);
app.use('/api/akts', protect, aktRoutes);

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda TAM HAZIRDIR!`);
});