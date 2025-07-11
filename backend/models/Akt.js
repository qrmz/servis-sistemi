// backend/models/Akt.js

const mongoose = require('mongoose');

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

module.exports = Akt;