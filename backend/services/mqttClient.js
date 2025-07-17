const mqtt = require('mqtt');
const MqttConfig = require('./models/mqttConfig');

let client = null;

async function connectMqtt() {
  try {
    const config = await MqttConfig.findOne({});

    if (!config) {
      console.log('Configuração MQTT não encontrada');
      return null;
    }

    const protocol = config.ssl ? 'mqtts' : 'mqtt';
    const url = `${protocol}://${config.host}:${config.port}`;

    const options = {
      username: config.user,
      password: config.pass,
    };

    client = mqtt.connect(url, options);

    return new Promise((resolve, reject) => {
      client.on('connect', () => {
        console.log('MQTT conectado!');
        resolve(client);
      });

      client.on('error', (err) => {
        console.error('Erro MQTT:', err);
        client.end();
        reject(err);
      });
    });
  } catch (error) {
    console.error('Erro ao conectar MQTT:', error);
    throw error;
  }
}

function getClient() {
  if (!client) {
    throw new Error('Cliente MQTT não conectado ainda');
  }
  return client;
}

module.exports = {
  connectMqtt,
  getClient,
};
