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

// Pega todos dispositivos do catálogo (para o picker)
export async function getAllDevices() {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(`${API_BASE_URL}/devicecatalog`, { headers });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar todos os dispositivos:', error.response?.data || error.message);
    throw new Error('Erro ao buscar dispositivos');
  }
}
