const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// POST /api/users/register
router.post('/register', async (req, res) => {
  try {
    const { username, password, storeName } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Bu istifadəçi adı artıq mövcuddur' });
    }
    const user = new User({ username, password, storeName });
    await user.save();
    res.status(201).json({ message: 'İstifadəçi uğurla yaradıldı' });
  } catch (error) {
    res.status(500).json({ message: 'Server xətası', error: error.message });
  }
});

// POST /api/users/login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'İstifadəçi adı və ya şifrə səhvdir' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'İstifadəçi adı və ya şifrə səhvdir' });
        }
        const payload = {
            id: user._id,
            username: user.username,
            role: user.role
        };
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        res.status(200).json({
            message: 'Uğurla daxil oldunuz',
            token: token
        });
    } catch (error) {
        res.status(500).json({ message: 'Server xətası', error: error.message });
    }
});

module.exports = router;