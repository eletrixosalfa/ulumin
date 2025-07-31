const Device = require('../models/Device');

exports.createDevice = async (req, res) => {
  try {
    const { name, icon, status, ipAddress, category, room } = req.body;

    const newDevice = new Device({
      name,
      icon,
      status,
      ipAddress,
      category,
      room,            // certifique-se que o modelo tem esse campo
      owner: req.user.userId
    });

    await newDevice.save();
    res.status(201).json(newDevice);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao criar dispositivo.', error: err.message });
  }
};

exports.getDevicesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const devices = await Device.find({
      owner: req.user.userId,
      category: categoryId
    }).populate('category');

    res.status(200).json(devices);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao obter dispositivos.', error: err.message });
  }
};

// NOVO: pegar dispositivos por room
exports.getDevicesByRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    const devices = await Device.find({
      owner: req.user.userId,
      room: roomId
    }).populate('category');

    res.status(200).json(devices);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao obter dispositivos por divisão.', error: err.message });
  }
};

// NOVO: pegar dispositivos filtrando por categoria E divisão (room)
exports.getDevicesByCategoryAndRoom = async (req, res) => {
  try {
    const { categoryId, roomId } = req.params;

    const devices = await Device.find({
      owner: req.user.userId,
      category: categoryId,
      room: roomId
    }).populate('category');

    res.status(200).json(devices);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao obter dispositivos por categoria e divisão.', error: err.message });
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
    const deleted = await Device.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.userId
    });
    if (!deleted) return res.status(404).json({ message: 'Dispositivo não encontrado.' });
    res.json({ message: 'Dispositivo eliminado.' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao eliminar dispositivo.', error: err.message });
  }
};
