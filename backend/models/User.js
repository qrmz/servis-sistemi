// backend/models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  storeName: { type: String, required: true },
  role: { type: String, default: 'user' } // 'user' və ya 'admin' kimi rollar üçün
});

// Bu, istifadəçi bazaya yazılmazdan ƏVVƏL işə düşən bir funksiyadır
// Məqsədi, şifrəni avtomatik olaraq şifrələməkdir (hash)
userSchema.pre('save', async function(next) {
  // Əgər şifrə dəyişməyibsə, heç nə etmə
  if (!this.isModified('password')) {
    return next();
  }
  // Əgər şifrə yenidirsə və ya dəyişibsə, onu şifrələ
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;