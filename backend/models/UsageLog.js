const mongoose = require('mongoose');

const usageLogSchema = new mongoose.Schema({
  device: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true },
  action: { type: String, enum: ['on', 'off'], required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('UsageLog', usageLogSchema);