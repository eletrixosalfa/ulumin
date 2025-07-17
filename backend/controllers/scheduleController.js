const Schedule = require('../models/schedule');

exports.createSchedule = async (req, res) => {
  try {
    const { device, action, time, repeat } = req.body;
    const newSchedule = new Schedule({
      device,
      action,
      time,
      repeat,
      owner: req.user.userId
    });
    await newSchedule.save();
    res.status(201).json(newSchedule);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao criar schedule.', error: err.message });
  }
};

exports.getSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find({ owner: req.user.userId }).populate('device');
    if (schedules.length === 0) {
      return res.status(200).json({ message: 'Nenhuma schedule encontrada.' });
    }
    res.status(200).json(schedules);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao obter schedules.', error: err.message });
  }
};

exports.updateSchedule = async (req, res) => {
  try {
    const updated = await Schedule.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.userId },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Schedule não encontrada.' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao atualizar schedule.', error: err.message });
  }
};

exports.deleteSchedule = async (req, res) => {
  try {
    const deleted = await Schedule.findOneAndDelete({ _id: req.params.id, owner: req.user.userId });
    if (!deleted) return res.status(404).json({ message: 'Schedule não encontrada.' });
    res.json({ message: 'Schedule eliminada.' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao eliminar schedule.', error: err.message });
  }
};
