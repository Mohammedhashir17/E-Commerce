import axios from 'axios';

const API_BASE_URL = 'https://zuka-backend.onrender.com/api/v1';

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

// Invoice download - returns blob for PDF download
export const downloadInvoice = async (orderId, productIndex = null) => {
  try {
    const token = localStorage.getItem('admin_token');
    const url = productIndex !== null 
      ? `${API_BASE_URL}/orders/${orderId}/invoice/${productIndex}`
      : `${API_BASE_URL}/orders/${orderId}/invoice`;
    
    const response = await axios.get(url, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
      responseType: 'blob',
    });
    
    // Create blob URL and trigger download
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url_blob = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url_blob;
    link.download = `invoice-${orderId}${productIndex !== null ? `-${productIndex}` : ''}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url_blob);
  } catch (error) {
    console.error('Error downloading invoice:', error);
    throw error;
  }
};

// Category APIs
export const getCategories = () => api.get('/products/categories');

export default api;
