const MqttConfig = require('../models/mqttConfig');
const mqtt = require('mqtt');

exports.createOrUpdateMqttConfig = async (req, res) => {
  try {
    const { host, user, pass, port, ssl } = req.body || {};

    let config = await MqttConfig.findOne({ owner: req.user.userId });

    if (config) {
      config.host = host;
      config.user = user;
      config.pass = pass;
      config.port = port;
      config.ssl = ssl;
      await config.save();
    } else {
      config = new MqttConfig({
        host,
        user,
        pass,
        port,
        ssl,
        owner: req.user.userId
      });
      await config.save();
    }

    res.status(200).json(config);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao guardar configurações MQTT.', error: err.message });
  }
};

exports.getMqttConfig = async (req, res) => {
  try {
    const config = await MqttConfig.findOne({ owner: req.user.userId });
    if (!config) return res.status(404).json({ message: 'Nenhuma configuração encontrada.' });
    res.json(config);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao procurar configurações.', error: err.message });
  }
};

exports.deleteMqttConfig = async (req, res) => {
  try {
    const deleted = await MqttConfig.findOneAndDelete({ owner: req.user.userId });
    if (!deleted) return res.status(404).json({ message: 'Configuração MQTT não encontrada.' });
    res.json({ message: 'Configuração MQTT eliminada com sucesso.' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao eliminar configuração.', error: err.message });
  }
};

// 1 - Testar conexão MQTT
exports.testMqttConnection = async (req, res) => {
  const { host, user, pass, port, ssl } = req.body;
  try {
    const protocol = ssl ? 'mqtts' : 'mqtt';
    const url = `${protocol}://${host}:${port}`;
    const options = {
      username: user || undefined,
      password: pass || undefined,
      connectTimeout: 4000,
    };

    const client = mqtt.connect(url, options);
    let responded = false;

    client.on('connect', () => {
      if (!responded) {
        responded = true;
        client.end();
        return res.json({ success: true, message: 'Conexão MQTT bem sucedida' });
      }
    });

    client.on('error', (err) => {
      if (!responded) {
        responded = true;
        client.end();
        return res.status(400).json({ success: false, message: 'Falha na conexão MQTT', error: err.message });
      }
    });

    setTimeout(() => {
      if (!responded) {
        responded = true;
        client.end();
        return res.status(408).json({ success: false, message: 'Timeout na tentativa de conexão MQTT' });
      }
    }, 5000);

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Erro ao testar conexão MQTT', error: error.message });
  }
};

// 2 - Resetar configuração MQTT para padrão
exports.resetMqttConfig = async (req, res) => {
  try {
    const defaultConfig = {
      host: 'broker.hivemq.com',
      user: '',
      pass: '',
      port: 1883,
      ssl: false,
    };

    let config = await MqttConfig.findOne({ owner: req.user.userId });

    if (config) {
      config.host = defaultConfig.host;
      config.user = defaultConfig.user;
      config.pass = defaultConfig.pass;
      config.port = defaultConfig.port;
      config.ssl = defaultConfig.ssl;
      await config.save();
    } else {
      config = new MqttConfig({ ...defaultConfig, owner: req.user.userId });
      await config.save();
    }

    res.json({ message: 'Configuração resetada com sucesso', config });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao resetar configuração.', error: err.message });
  }
};

// 3 - Status da conexão MQTT (simple check)
exports.getMqttStatus = async (req, res) => {
  try {
    const config = await MqttConfig.findOne({ owner: req.user.userId });
    if (!config) return res.status(404).json({ message: 'Nenhuma configuração encontrada.' });

    const protocol = config.ssl ? 'mqtts' : 'mqtt';
    const url = `${protocol}://${config.host}:${config.port}`;
    const options = { username: config.user, password: config.pass, connectTimeout: 3000 };

    const client = mqtt.connect(url, options);
    let responded = false;

    client.on('connect', () => {
      if (!responded) {
        responded = true;
        client.end();
        return res.json({ status: 'connected', message: '✅ Conectado' });
      }
    });

    client.on('error', (err) => {
      if (!responded) {
        responded = true;
        client.end();
        return res.json({ status: 'disconnected', message: '❌ Desconectado', error: err.message });
      }
    });

    setTimeout(() => {
      if (!responded) {
        responded = true;
        client.end();
        return res.json({ status: 'disconnected', message: '❌ Desconectado (timeout)' });
      }
    }, 4000);

  } catch (err) {
    res.status(500).json({ message: 'Erro ao obter status.', error: err.message });
  }
};
