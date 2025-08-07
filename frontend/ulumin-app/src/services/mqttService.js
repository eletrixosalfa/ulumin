import api from '../api/axios'; // importa o axios configurado

// Procurar configuração MQTT atual
export async function getMqttConfig() {
  try {
    const response = await api.get('/mqttconfig');
    return response.data;
  } catch (error) {
    console.error('Erro ao procurar  configuração MQTT:', error);
    throw error;
  }
}

// Criar ou atualizar configuração MQTT
export async function createOrUpdateMqttConfig(configData) {
  try {
    const response = await api.post('/mqttconfig', configData);
    return response.data;
  } catch (error) {
    console.error('Erro ao salvar configuração MQTT:', error);
    throw error;
  }
}

// Testar conexão MQTT
export async function testMqttConnection(configData) {
  try {
    const response = await api.post('/mqttconfig/test', configData);
    return response.data;
  } catch (error) {
    console.error('Erro ao testar conexão MQTT:', error);
    throw error;
  }
}

// Resetar configuração MQTT para padrão
export async function resetMqttConfig() {
  try {
    const response = await api.post('/mqttconfig/reset');
    return response.data;
  } catch (error) {
    console.error('Erro ao resetar configuração MQTT:', error);
    throw error;
  }
}

// Buscar status atual da conexão MQTT
export async function getMqttStatus() {
  try {
    const response = await api.get('/mqttconfig/status');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar status MQTT:', error);
    throw error;
  }
}
