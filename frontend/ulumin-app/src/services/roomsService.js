import api from '../api/axios'; // importa o axios configurado

export async function getRooms() {
  try {
    const response = await api.get('/rooms'); // ajusta endpoint se necessário
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar divisões:', error);
    throw error;
  }
}

// Função para criar nova divisão
export async function createRoom(roomData) {
  try {
    const response = await api.post('/rooms', roomData);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar divisão:', error);
    throw error;
  }
}

// Função para atualizar divisão existente
export async function updateRoom(id, roomData) {
  try {
    const response = await api.put(`/rooms/${id}`, roomData);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar divisão:', error);
    throw error;
  }
}

// Função para deletar divisão
export async function deleteRoom(id) {
  try {
    const response = await api.delete(`/rooms/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao deletar divisão:', error);
    throw error;
  }
}
