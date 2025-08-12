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

// Criar dispositivo
export async function createDevice(data) {
  const headers = await getAuthHeaders();
  const response = await axios.post(`${API_BASE_URL}/devices`, data, { headers });
  return response.data;
}

// Eliminar dispositivo
export async function deleteDevice(deviceId) {
  const headers = await getAuthHeaders();
  const response = await axios.delete(`${API_BASE_URL}/devices/${deviceId}`, { headers });
  return response.data;
}

// Procurar dispositivos por categoria
export async function getDevicesByCategory(categoryId) {
  const headers = await getAuthHeaders();
  const response = await axios.get(`${API_BASE_URL}/devices/category/${categoryId}`, { headers });
  return response.data;
}

// Procurar dispositivos por divisão
export async function getDevicesByRoom(roomId) {
  const headers = await getAuthHeaders();
  const response = await axios.get(`${API_BASE_URL}/devices/room/${roomId}`, { headers });
  return response.data;
}

// Procurar dispositivos por categoria e divisão
export async function getDevicesByCategoryAndRoom(categoryId, roomId) {
  const headers = await getAuthHeaders();
  const response = await axios.get(`${API_BASE_URL}/devices/category/${categoryId}/room/${roomId}`, { headers });
  return response.data;
}

// Adicionar ação a um dispositivo
export async function addActionToDevice(deviceId, action) {
  const headers = await getAuthHeaders();
  const response = await axios.post(`${API_BASE_URL}/devices/${deviceId}/actions`, action, { headers });
  return response.data;
}

// Remover ação de um dispositivo (por índice)
export async function removeActionFromDevice(deviceId, index) {
  const headers = await getAuthHeaders();
  const response = await axios.delete(`${API_BASE_URL}/devices/${deviceId}/actions/${index}`, { headers });
  return response.data;
}
