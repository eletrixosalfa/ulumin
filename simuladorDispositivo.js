const mqtt = require('mqtt');

function criarDispositivo(id, model, name) {
  const client = mqtt.connect('mqtt://broker.hivemq.com:1883');
  client.on('connect', () => {
    client.subscribe('ulumin/announce');
    console.log(`Dispositivo ${id} conectado e está a aguardar o announce...`);
  });
  client.on('message', (topic, message) => {
    if (topic === 'ulumin/announce') {
      client.publish('ulumin/announce/response', JSON.stringify({ id, model, name }));
      console.log(`Dispositivo ${id} respondeu ao announce!`);
    }
  });
}

criarDispositivo('simulador-01', 'Blinds', 'Estore Teste');
criarDispositivo('simulador-02', 'Lights', 'Lampada Teste');
criarDispositivo('simulador-03', 'Sensors', 'Sensor Teste');
criarDispositivo('simulador-04', 'Switches', 'Interruptor Teste');