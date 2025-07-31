const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String, default: 'devices' },
  status: { type: String, enum: ['on', 'off'], default: 'off' },
  ipAddress: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  actions: [
    {
      name: { type: String, required: true },
      command: { type: String }, 
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Device', deviceSchema);
