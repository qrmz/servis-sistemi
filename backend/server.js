require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// === CORS KONFİQURASİYASI ===
const allowedOrigins = [
  'https://6870353fcc0915a1375ce47f--spectacular-longma-83acd2.netlify.app', // Sizin Netlify saytınız
  'http://localhost:3001' // Sizin lokal frontend-iniz
];

const corsOptions = {
  origin: function (origin, callback) {
    // Əgər sorğu gələn ünvan icazə verilən siyahıdadırsa (və ya sorğunun origin-i yoxdursa, məsələn Postman kimi)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Bu mənbədən girişə CORS tərəfindən icazə verilmir'));
    }
  }
};

app.use(cors(corsOptions));
app.use(express.json());

// === DATABASE CONNECTION ===
const CONNECTION_STRING = process.env.CONNECTION_STRING;
mongoose.connect(CONNECTION_STRING)
  .then(() => console.log('Verilənlər bazasına uğurla qoşuldu!'))
  .catch((err) => console.error('Verilənlər bazasına qoşularkən xəta baş verdi:', err));

// === ROUTES ===
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const aktRoutes = require('./routes/aktRoutes');
app.use('/api/akts', aktRoutes);


app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda işə düşdü`);
});