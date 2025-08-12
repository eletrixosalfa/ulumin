import api from '../api/axios';

// Função para obter dados do perfil do usuário
export async function getProfile() {
  try {
    const response = await api.get('/updateuser/profile');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    throw error;
  }
}

// Função para atualizar nome e email do usuário
export async function updateProfile(profileData) {
  try {
    const response = await api.put('/updateuser/profile', profileData);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    throw error;
  }
}

// Função para alterar senha do usuário
export async function changePassword(currentPassword, newPassword) {
  try {
    const response = await api.put('/updateuser/password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    throw error;
  }
}
