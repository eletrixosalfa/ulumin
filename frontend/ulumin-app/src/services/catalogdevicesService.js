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

export async function getDevices(roomId) {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(`${API_BASE_URL}/devices/room/${roomId}`, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dispositivos:', error.response?.data || error.message);
    throw new Error('Erro ao buscar dispositivos');
  }
}

export async function getAllDevices() {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(`${API_BASE_URL}/devices`, { headers });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar todos os dispositivos:', error.response?.data || error.message);
    throw new Error('Erro ao buscar dispositivos');
  }
}

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

export async function deleteDevice(deviceId) {
  try {
    const headers = await getAuthHeaders();
    await axios.delete(`${API_BASE_URL}/devices/${deviceId}`, { headers });
    return true;
  } catch (error) {
    console.error('Erro ao deletar dispositivo:', error.response?.data || error.message);
    throw new Error('Erro ao deletar dispositivo');
  }
}
