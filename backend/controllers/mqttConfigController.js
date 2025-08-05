const MqttConfig = require('../models/mqttConfig');

// Criar ou atualizar configuração MQTT
exports.createOrUpdateMqttConfig = async (req, res) => {
  try {
    const { host, user, pass, port, ssl } = req.body || {};

    const existing = await MqttConfig.findOne({ owner: req.user.userId });

    if (existing) {
      existing.host = host;
      existing.user = user;
      existing.pass = pass;
      existing.port = port;
      existing.ssl = ssl;
      await existing.save();
      return res.status(200).json(existing);
    }

    const newConfig = new MqttConfig({
      host,
      user,
      pass,
      port,
      ssl,
      owner: req.user.userId
    });

    await newConfig.save();
    res.status(201).json(newConfig);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao salvar configurações MQTT.', error: err.message });
  }
};

// Obter configuração MQTT
exports.getMqttConfig = async (req, res) => {
  try {
    const config = await MqttConfig.findOne({ owner: req.user.userId });
    if (!config) return res.status(404).json({ message: 'Nenhuma configuração encontrada.' });
    res.json(config);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar configurações.', error: err.message });
  }
};

// Deletar configuração MQTT
exports.deleteMqttConfig = async (req, res) => {
  try {
    const deleted = await MqttConfig.findOneAndDelete({ owner: req.user.userId });
    if (!deleted) return res.status(404).json({ message: 'Configuração MQTT não encontrada.' });
    res.json({ message: 'Configuração MQTT eliminada com sucesso.' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao eliminar configuração.', error: err.message });
  }
};