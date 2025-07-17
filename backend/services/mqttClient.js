const mqtt = require('mqtt');
const MqttConfig = require('../models/mqttConfig');

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

        // Subscrever a um tópico de teste
        client.subscribe('ulumin/test', (err) => {
          if (err) {
            console.error('Erro ao se inscrever no tópico:', err);
          } else {
            console.log('Inscrito no tópico ulumin/test');
            client.publish('ulumin/test', 'Olá do servidor via MQTT!');
          }
        });

        resolve(client);
      });

      client.on('message', (topic, message) => {
        console.log(`Mensagem recebida no tópico ${topic}: ${message.toString()}`);
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
