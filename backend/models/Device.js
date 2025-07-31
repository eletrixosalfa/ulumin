const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String, default: 'devices' }, // agora ícone vem do utilizador
  status: { type: String, enum: ['on', 'off'], default: 'off' },
  ipAddress: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Device', deviceSchema);
