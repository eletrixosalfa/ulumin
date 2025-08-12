import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getToken() {
  try {
    return await AsyncStorage.getItem('token');
  } catch (e) {
    console.log('Erro ao ler token:', e);
    return null;
  }
}

export async function setToken(token) {
  try {
    await AsyncStorage.setItem('token', token);
  } catch (e) {
    console.log('Erro ao guardar token:', e);
  }
}

export async function removeToken() {
  try {
    await AsyncStorage.removeItem('token');
  } catch (e) {
    console.log('Erro ao remover token:', e);
  }
}