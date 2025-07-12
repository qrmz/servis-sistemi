// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Tokeni 'Bearer eyJ...' formatından ayırırıq
      token = req.headers.authorization.split(' ')[1];

      // Tokeni yoxlayırıq
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // İstifadəçini bazadan tapıb, şifrə olmadan sorğuya əlavə edirik
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Hər şey qaydasındadırsa, növbəti əməliyyata keç
    } catch (error) {
      res.status(401).json({ message: 'Giriş üçün icazə yoxdur, token səhvdir' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Giriş üçün icazə yoxdur, token tapılmadı' });
  }
};

module.exports = { protect };