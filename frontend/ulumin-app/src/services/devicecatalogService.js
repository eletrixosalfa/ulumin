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

// Buscar rooms
export async function getRooms() {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(`${API_BASE_URL}/rooms`, { headers });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar rooms:', error.response?.data || error.message);
    throw new Error('Erro ao buscar rooms');
  }
}

// Buscar ações de dispositivo por modelo
export async function getDeviceActions(model) {
  if (!model) return [];
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(`${API_BASE_URL}/devicecatalog/model/${model}`, { headers });
    return response.data.actions || [];
  } catch (error) {
    console.error('Erro ao buscar ações do dispositivo:', error.response?.data || error.message);
    return [];
  }
} 
