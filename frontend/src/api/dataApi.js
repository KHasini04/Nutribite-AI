import api from './axiosConfig';

export const getBudget = async () => {
  try {
    const response = await api.get('/budget/');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

export const updateProfile = async (profileData) => {
  try {
    const response = await api.put('/profile/', profileData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

export const getOrders = async () => {
  try {
    const response = await api.get('/orders/');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

export const getRecommendations = async () => {
  try {
    const response = await api.get('/recommend/');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

export const createRecommendation = async (prompt) => {
  try {
    const response = await api.post('/recommend/', { prompt });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

export const getNutrition = async (foodName) => {
  try {
    const response = await api.get(`/nutrition/${foodName}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

export const addOrder = async (orderData) => {
  try {
    const response = await api.post('/orders/', orderData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

export const deleteOrder = async (orderId) => {
  try {
    const response = await api.delete(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

export const clearOrders = async () => {
  try {
    const response = await api.delete('/orders/');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};
