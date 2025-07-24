const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  devices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Device' }],
  icon: { type: String, default: 'home' }, 
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
