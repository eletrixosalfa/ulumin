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

export async function getCategoriesByRoom(roomId) {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(`${API_BASE_URL}/categories/room/${roomId}`, { headers });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar categorias da divisão:', error.response?.data || error.message);
    throw new Error('Erro ao buscar categorias');
  }
}

export async function createCategory(data) {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.post(`${API_BASE_URL}/categories`, data, { headers });
    return response.data;
  } catch (error) {
    console.error('Erro ao criar categoria:', error.response?.data || error.message);
    throw new Error('Erro ao criar categoria');
  }
}

export async function deleteCategory(categoryId) {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.delete(`${API_BASE_URL}/categories/${categoryId}`, { headers });
    return response.data;
  } catch (error) {
    console.error('Erro ao eliminar categoria:', error.response?.data || error.message);
    throw new Error('Erro ao eliminar categoria');
  }
}
