const mongoose = require('mongoose');

const mqttConfigSchema = new mongoose.Schema({
  user: { type: String },
  pass: { type: String },
  port: { type: Number },
  ssl: { type: Boolean },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('MqttConfig', mqttConfigSchema);
