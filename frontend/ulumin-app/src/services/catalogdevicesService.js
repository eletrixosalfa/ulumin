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

// Procurar dispositivos por categoria
export async function getDevicesByCategory(categoryId) {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(`${API_BASE_URL}/devices/category/${categoryId}`, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao procurar dispositivos por categoria:', error.response?.data || error.message);
    throw new Error('Erro ao procurar dispositivos');
  }
}

// Criar dispositivo
export async function createDevice(device) {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.post(`${API_BASE_URL}/devices`, device, { headers });
    return response.data;
  } catch (error) {
    console.error('Erro ao criar dispositivo:', error.response?.data || error.message);
    throw new Error('Erro ao criar dispositivo');
  }
}

// Atualizar dispositivo
export async function updateDevice(deviceId, deviceData) {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.put(`${API_BASE_URL}/devices/${deviceId}`, deviceData, { headers });
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar dispositivo:', error.response?.data || error.message);
    throw new Error('Erro ao atualizar dispositivo');
  }
}

// Eliminar dispositivo
export async function deleteDevice(deviceId) {
  try {
    const headers = await getAuthHeaders();
    await axios.delete(`${API_BASE_URL}/devices/${deviceId}`, { headers });
    return true;
  } catch (error) {
    console.error('Erro ao eliminar dispositivo:', error.response?.data || error.message);
    throw new Error('Erro ao eliminar dispositivo');
  }
}

export async function getRooms() {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(`${API_BASE_URL}/rooms`, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar rooms:', error.response?.data || error.message);
    throw new Error('Erro ao buscar rooms');
  }
}
