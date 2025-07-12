require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { protect } = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Konfiqurasiyası
app.use(cors()); 
app.use(express.json());

// Database Connection
mongoose.connect(process.env.CONNECTION_STRING)
  .then(() => console.log('Verilənlər bazasına uğurla qoşuldu!'))
  .catch((err) => console.error('Verilənlər bazasına qoşularkən xəta baş verdi:', err));

// Routes
const userRoutes = require('./routes/userRoutes');
const aktRoutes = require('./routes/aktRoutes');

app.use('/api/users', userRoutes);
app.use('/api/akts', protect, aktRoutes); // Bütün akt sorğuları artıq qorunur

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda işləyir və hazırdır!`);
});