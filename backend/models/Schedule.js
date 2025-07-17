const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  device: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true },
  action: { type: String, enum: ['on', 'off'], required: true },
  time: { type: String, required: true }, // HH:mm format
  repeat: { type: [String], enum: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Schedule', scheduleSchema);
