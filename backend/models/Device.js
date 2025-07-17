const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['light', 'socket', 'sensor'], required: true },
  status: { type: String, enum: ['on', 'off'], default: 'off' },
  ipAddress: { type: String },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Device', deviceSchema);
