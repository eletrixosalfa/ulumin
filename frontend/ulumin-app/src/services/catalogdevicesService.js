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

export async function getDevicesByRoom(roomId) {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(`${API_BASE_URL}/devices/room/${roomId}`, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dispositivos por divisão:', error.response?.data || error.message);
    throw new Error('Erro ao buscar dispositivos por divisão');
  }
}

// Função para buscar todas as rooms (divisões)
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
