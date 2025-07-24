const Device = require('../models/Device');

exports.createDevice = async (req, res) => {
  try {
    const { name, category, status, ipAddress, room } = req.body;
    const newDevice = new Device({
      name,
      category,
      status,
      ipAddress,
      room,
      owner: req.user.userId
    });

    await newDevice.save();
    res.status(201).json(newDevice);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao criar dispositivo.', error: err.message });
  }
};

exports.getDevices = async (req, res) => {
  try {
    const { roomId } = req.params;

    const devices = await Device.find({
      owner: req.user.userId,
      room: roomId
    }).populate('room');

    if (devices.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(devices);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao obter dispositivos.', error: err.message });
  }
};


exports.updateDevice = async (req, res) => {
  try {
    const updated = await Device.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.userId },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Dispositivo não encontrado.' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao atualizar dispositivo.', error: err.message });
  }
};

exports.deleteDevice = async (req, res) => {
  try {
    const deleted = await Device.findOneAndDelete({ _id: req.params.id, owner: req.user.userId });
    if (!deleted) return res.status(404).json({ message: 'Dispositivo não encontrado.' });
    res.json({ message: 'Dispositivo eliminado.' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao eliminar dispositivo.', error: err.message });
  }
};
