const Room = require('../models/room');

exports.createRoom = async (req, res) => {
  try {
    const { name, description } = req.body;
    const newRoom = new Room({
      name,
      description,
      owner: req.user.userId
    });
    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao criar sala.', error: err.message });
  }
};

exports.getRooms = async (req, res) => {
  try {
    // Corrigido: parênteses na query e no populate ('devices' no plural, se for o nome correto do campo)
    const rooms = await Room.find({ owner: req.user.userId }).populate('devices'); 
    if (rooms.length === 0) {
      return res.status(200).json({ message: 'Nenhuma sala encontrada.' });
    }
    res.status(200).json(rooms);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao obter salas.', error: err.message });
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const updated = await Room.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.userId },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Sala não encontrada.' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao atualizar sala.', error: err.message });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    const deleted = await Room.findOneAndDelete({ _id: req.params.id, owner: req.user.userId });
    if (!deleted) return res.status(404).json({ message: 'Sala não encontrada.' });
    res.json({ message: 'Sala eliminada.' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao eliminar sala.', error: err.message });
  }
};
