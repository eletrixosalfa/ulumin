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

export async function getSchedules() {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(`${API_BASE_URL}/schedules`, { headers });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar schedules:', error.response?.data || error.message);
    throw new Error('Erro ao buscar schedules');
  }
}

export async function createSchedule(scheduleData) {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.post(`${API_BASE_URL}/schedules`, scheduleData, { headers });
    return response.data;
  } catch (error) {
    console.error('Erro ao criar schedule:', error.response?.data || error.message);
    throw new Error('Erro ao criar schedule');
  }
}

export async function updateSchedule(scheduleId, scheduleData) {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.put(`${API_BASE_URL}/schedules/${scheduleId}`, scheduleData, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar schedule:', error.response?.data || error.message);
    throw new Error('Erro ao atualizar schedule');
  }
}

export async function deleteSchedule(scheduleId) {
  console.log('Deleting schedule with ID:', scheduleId);
  try {
    const headers = await getAuthHeaders();
    await axios.delete(`${API_BASE_URL}/schedules/${scheduleId}`, { headers });
    return true;
  } catch (error) {
    console.error('Erro ao deletar schedule:', error.response?.data || error.message);
    throw new Error('Erro ao deletar schedule');
  }
}
