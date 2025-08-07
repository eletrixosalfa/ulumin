import api from '../api/api';
import { getToken } from '../utils/token'; // se já tiveres esta função

export const getProfile = async () => {
  const token = await getToken();
  const res = await api.get('/user/profile', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateProfile = async (name, email) => {
  const token = await getToken();
  const res = await api.put(
    '/user/profile',
    { name, email },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

export const changePassword = async (currentPassword, newPassword) => {
  const token = await getToken();
  const res = await api.put(
    '/user/password',
    { currentPassword, newPassword },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};
