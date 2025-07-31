const mongoose = require('mongoose');

const deviceCatalogSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  icon: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('DeviceCatalog', deviceCatalogSchema);
