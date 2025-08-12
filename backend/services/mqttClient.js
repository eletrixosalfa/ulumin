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

 const options = {};

// Só adiciona autenticação se houver username e password
if (config.user && config.pass) {
  options.username = config.user;
  options.password = config.pass;
}

    client = mqtt.connect(url, options);

    return new Promise((resolve, reject) => {
      client.on('connect', () => {
        console.log('MQTT conectado!');

        // Subscrever um tópico de teste
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

function announceDevices() {
  if (!client) throw new Error('MQTT não conectado');
  client.publish('ulumin/announce', 'announce');
}

function listenAnnounceResponses(onDeviceFound) {
  if (!client) throw new Error('MQTT não conectado');
  client.subscribe('ulumin/announce/response');
  client.on('message', (topic, message) => {
    if (topic === 'ulumin/announce/response') {
      try {
        const deviceInfo = JSON.parse(message.toString());
        onDeviceFound(deviceInfo);
      } catch (e) {
        console.error('Resposta de announce inválida:', message.toString());
      }
    }
  });
}

module.exports = {
  connectMqtt,
  getClient,
  announceDevices,
  listenAnnounceResponses,
};
