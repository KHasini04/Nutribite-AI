import api from './axiosConfig';

export const signupUser = async (userData) => {
  try {
    const response = await api.post(`/auth/signup`, userData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post(`/auth/login`, credentials);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};
