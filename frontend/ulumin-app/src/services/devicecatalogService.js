import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://ulumin-backend.onrender.com/api';

async function getAuthHeaders() {
  const token = await AsyncStorage.getItem('userToken');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

// Procurar divisões
export async function getRooms() {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(`${API_BASE_URL}/rooms`, { headers });
    return response.data;
  } catch (error) {
    console.error('Erro ao procurar divisões:', error.response?.data || error.message);
    throw new Error('Erro ao procurar divisões.');
  }
}

// Procurar ações de dispositivo por modelo
export async function getDeviceActions(model) {
  if (!model) return [];
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(`${API_BASE_URL}/devicecatalog/model/${model}`, { headers });
    return response.data.actions || [];
  } catch (error) {
    console.error('Erro ao procurar ações do dispositivo:', error.response?.data || error.message);
    return [];
  }
} 

// Excluir dispositivo
export async function deleteDevice(deviceId) {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.delete(`${API_BASE_URL}/devices/${deviceId}`, { headers });
    return response.data;
  } catch (error) {
    console.error('Erro ao deletar dispositivo:', error.response?.data || error.message);
    throw new Error('Não foi possível excluir o dispositivo');
  }
}
