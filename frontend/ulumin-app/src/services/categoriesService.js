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

export async function getCategories() {
  const headers = await getAuthHeaders();
  const response = await axios.get(`${API_BASE_URL}/categories`, { headers });
  return response.data;
}

export async function createCategory(data) {
  const headers = await getAuthHeaders();
  const response = await axios.post(`${API_BASE_URL}/categories`, data, { headers });
  return response.data;
}

export async function deleteCategory(categoryId) {
  const headers = await getAuthHeaders();
  const response = await axios.delete(`${API_BASE_URL}/categories/${categoryId}`, { headers });
  return response.data;
}
