import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Função para receber o token no async storage (React Native)
export async function getToken() {
  try {
    return await AsyncStorage.getItem('userToken');
  } catch (e) {
    console.log('Erro ao ler token:', e);
    return null;
  }
}

const API_BASE_URL = 'https://ulumin-backend.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Adicionar interceptor para enviar o token no header se existir
api.interceptors.request.use(
  async config => {
    const token = await getToken(); // função para receber o token guardado no AsyncStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default api;