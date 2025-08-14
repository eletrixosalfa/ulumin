const deviceCatalog = require('../models/DeviceCatalog');

module.exports = {
  getActionsByModel: (req, res) => {
    const { model } = req.params;
    const found = deviceCatalog.find(d => d.model === model);
    if (found) {
      res.json({ actions: found.actions });
    } else {
      res.json({ actions: [] });
    }
  },

  getAllCatalogDevices: (req, res) => {
    res.json(deviceCatalog);
  },

  addCatalogDevice: (req, res) => {
    const { model, actions } = req.body;
    deviceCatalog.push({ model, actions });
    res.status(201).json({ message: 'Dispositivo adicionado!' });
  }
};
