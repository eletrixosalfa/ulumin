const mqtt = require('mqtt');
const MqttConfig = require('../models/mqttConfig');
let client = null;

// Estabelece ligação ao broker MQTT
async function connectMqtt() {
  try {
    // Procura a configuração do MQTT guardada na base de dados
    const config = await MqttConfig.findOne({});

    if (!config) {
      console.log('Configuração MQTT não encontrada');
      return null;
    }

    const protocol = config.ssl ? 'mqtts' : 'mqtt';
    const url = `${protocol}://${config.host}:${config.port}`;
    const options = {};

    // Só adiciona autenticação se houver utilizador e palavra-passe definidos
    if (config.user && config.pass) {
      options.username = config.user;
      options.password = config.pass;
    }

    // Cria o cliente MQTT
    client = mqtt.connect(url, options);

    // Retorna uma Promise que resolve quando a ligação estiver estabelecida
    return new Promise((resolve, reject) => {
      // Evento disparado quando o cliente consegue ligar-se ao broker
      client.on('connect', () => {
        console.log('MQTT conectado!');

        // Subscreve um tópico de teste
        client.subscribe('ulumin/test', (err) => {
          if (err) {
            console.error('Erro ao subscrever o tópico:', err);
          } else {
            console.log('Subscreveu o tópico ulumin/test');
            client.publish('ulumin/test', 'Olá do servidor via MQTT!');
          }
        });
        resolve(client); 
      });

      // Evento disparado sempre que chega uma mensagem a um tópico subscrito
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

// Devolve o cliente MQTT se já estiver conectado, senão lança erro
function getClient() {
  if (!client) {
    throw new Error('Cliente MQTT não está conectado ainda');
  }
  return client;
}

// Publica uma mensagem de "announce" para pedir que os dispositivos se identifiquem
function announceDevices() {
  if (!client) throw new Error('MQTT não conectado');
  client.publish('ulumin/announce', 'announce');
}

// Subscreve respostas ao "announce" e chama a callback quando um dispositivo responde
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