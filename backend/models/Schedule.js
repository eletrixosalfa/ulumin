const mongoose = require('mongoose');
const deviceCatalog = require('./DeviceCatalog');

// Junta todas as ações de todos os modelos em um único array
const allActions = deviceCatalog.flatMap(device => device.actions);

const scheduleSchema = new mongoose.Schema({
  device: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true },
  action: { type: String, enum: allActions, required: true },
  time: { type: String, required: true }, // HH:mm
  repeat: { type: [String], enum: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Schedule', scheduleSchema);
