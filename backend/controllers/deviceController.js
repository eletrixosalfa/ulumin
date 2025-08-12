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
      room,         
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

// Receber dispositivos por divisão
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

// Receber dispositivos filtrados por categoria e divisão
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

exports.addActionToDevice = async (req, res) => {
  try {
    const { name, command } = req.body;
    const device = await Device.findOne({
      _id: req.params.id,
      owner: req.user.userId
    });

    if (!device) return res.status(404).json({ message: 'Dispositivo não encontrado.' });

    device.actions.push({ name, command });
    await device.save();

    res.status(200).json(device);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao adicionar ação.', error: err.message });
  }
};

exports.removeActionFromDevice = async (req, res) => {
  try {
    const device = await Device.findOne({
      _id: req.params.id,
      owner: req.user.userId
    });

    if (!device) return res.status(404).json({ message: 'Dispositivo não encontrado.' });

    const index = parseInt(req.params.index);
    if (isNaN(index) || index < 0 || index >= device.actions.length) {
      return res.status(400).json({ message: 'Índice de ação inválido.' });
    }

    device.actions.splice(index, 1);
    await device.save();

    res.status(200).json(device);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao remover ação.', error: err.message });
  }
};
