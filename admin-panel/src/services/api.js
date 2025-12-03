import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/v1';

const getAuthHeaders = () => {
  const token = localStorage.getItem('admin_token');
  return {
    Authorization: token ? `Bearer ${token}` : undefined,
  };
};

export const api = {
  get: async (url) => {
    try {
      const response = await axios.get(`${API_BASE_URL}${url}`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error(`API GET Error for ${url}:`, error.response?.data || error.message);
      throw error;
    }
  },
  post: async (url, data) => {
    const response = await axios.post(`${API_BASE_URL}${url}`, data, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },
  put: async (url, data) => {
    const response = await axios.put(`${API_BASE_URL}${url}`, data, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },
  delete: async (url) => {
    const response = await axios.delete(`${API_BASE_URL}${url}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },
};

// Product APIs
export const getProducts = () => api.get('/products');
export const getProductById = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// Order APIs
export const getOrders = () => api.get('/orders/all');
export const getOrderById = (id) => api.get(`/orders/${id}`);
export const updateOrderStatus = (id, status) => api.put(`/orders/${id}`, { status });
export const updateOrderToDelivered = (id) => api.put(`/orders/${id}/deliver`);

// Category APIs
export const getCategories = () => api.get('/products/categories');

export default api;

