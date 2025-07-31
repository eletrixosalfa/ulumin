const DeviceCatalog = require('../models/DeviceCatalog');

// GET all catalog devices
exports.getAllCatalogDevices = async (req, res) => {
  try {
    const devices = await DeviceCatalog.find();
    res.status(200).json(devices);
  } catch (err) {
    console.error('Erro ao obter dispositivos do catálogo:', err);
    res.status(500).json({ message: 'Erro ao obter dispositivos do catálogo' });
  }
};

// POST - add a new catalog device (opcional)
exports.addCatalogDevice = async (req, res) => {
  const { name, category, icon } = req.body;

  try {
    const newDevice = new DeviceCatalog({ name, category, icon });
    await newDevice.save();
    res.status(201).json(newDevice);
  } catch (err) {
    console.error('Erro ao adicionar dispositivo ao catálogo:', err);
    res.status(500).json({ message: 'Erro ao adicionar dispositivo ao catálogo' });
  }
};
