const UsageLog = require('../models/UsageLog');

exports.createUsageLog = async (req, res) => {
  try {
    const { device, action, startTime } = req.body;

    if (!device || !action || !startTime) {
      return res.status(400).json({ message: 'device, action e startTime são obrigatórios.' });
    }

    const newLog = new UsageLog({
      device,
      action,
      startTime,
      owner: req.user.userId
    });

    await newLog.save();
    res.status(201).json(newLog);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao criar log de uso.', error: err.message });
  }
};

exports.updateUsageLog = async (req, res) => {
  try {
    const { endTime } = req.body;

    if (!endTime) {
      return res.status(400).json({ message: 'endTime é obrigatório para atualização.' });
    }

    const updatedLog = await UsageLog.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.userId },
      { endTime },
      { new: true }
    );

    if (!updatedLog) {
      return res.status(404).json({ message: 'Log de uso não encontrado.' });
    }

    res.json(updatedLog);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao atualizar log de uso.', error: err.message });
  }
};

exports.getUsageLogs = async (req, res) => {
  try {
    const logs = await UsageLog.find({ owner: req.user.userId }).populate('device');
    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao obter logs de uso.', error: err.message });
  }
};
