import axios from 'axios';

const API_BASE_URL = 'https://zuka-backend.onrender.com/api/v1';

const HttpService = {
  get: async (url, config = {}) => {
    const token = localStorage.getItem('token');
    return axios.get(`${API_BASE_URL}${url}`, {
      ...config,
      headers: {
        ...config.headers,
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });
  },
  post: async (url, data, config = {}) => {
    const token = localStorage.getItem('token');
    return axios.post(`${API_BASE_URL}${url}`, data, {
      ...config,
      headers: {
        ...config.headers,
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });
  },
  put: async (url, data, config = {}) => {
    const token = localStorage.getItem('token');
    return axios.put(`${API_BASE_URL}${url}`, data, {
      ...config,
      headers: {
        ...config.headers,
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });
  },
  delete: async (url, config = {}) => {
    const token = localStorage.getItem('token');
    return axios.delete(`${API_BASE_URL}${url}`, {
      ...config,
      headers: {
        ...config.headers,
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });
  },
};

// Auth APIs
export const loginUser = async (credentials) => {
  const response = await HttpService.post('/auth/login', credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await HttpService.post('/auth/register', userData);
  return response.data;
};

export const getUserProfile = async () => {
  const response = await HttpService.get('/auth/profile');
  return response.data;
};

// OTP Authentication APIs
export const sendOTPForLogin = async (email) => {
  const response = await HttpService.post('/auth/send-otp-login', { email });
  return response.data;
};

export const verifyOTPAndLogin = async (email, otp) => {
  const response = await HttpService.post('/auth/verify-otp-login', { email, otp });
  return response.data;
};

export const sendOTPForRegister = async (email) => {
  const response = await HttpService.post('/auth/send-otp-register', { email });
  return response.data;
};

export const verifyOTPAndRegister = async (userData, otp) => {
  const response = await HttpService.post('/auth/verify-otp-register', { ...userData, otp });
  return response.data;
};

// Forgot Password APIs
export const sendForgotPasswordOTP = async (email) => {
  const response = await HttpService.post('/auth/forgot-password', { email });
  return response.data;
};

export const resetPasswordWithOTP = async (email, otp, newPassword) => {
  const response = await HttpService.post('/auth/reset-password', { email, otp, newPassword });
  return response.data;
};

// Product APIs
export const getAllProducts = async (filters = {}) => {
  const response = await HttpService.get('/products', { params: filters });
  return response.data;
};

export const getProductById = async (productId) => {
  const response = await HttpService.get(`/products/${productId}`);
  return response.data;
};

export const getProductsByCategory = async (category) => {
  const response = await HttpService.get(`/products/category/${category}`);
  return response.data;
};

export const getAllCategories = async () => {
  const response = await HttpService.get('/products/categories');
  return response.data;
};

// Cart APIs
export const getCart = async () => {
  const response = await HttpService.get('/cart');
  return response.data;
};

export const addToCart = async (productId, quantity = 1) => {
  const response = await HttpService.post('/cart/add', { productId, quantity });
  return response.data;
};

export const updateCartItem = async (itemId, quantity) => {
  const response = await HttpService.put(`/cart/${itemId}`, { quantity });
  return response.data;
};

export const removeFromCart = async (itemId) => {
  const response = await HttpService.delete(`/cart/${itemId}`);
  return response.data;
};

export const clearCart = async () => {
  const response = await HttpService.delete('/cart');
  return response.data;
};

// Wishlist APIs
export const getWishlist = async () => {
  const response = await HttpService.get('/wishlist');
  return response.data;
};

export const addToWishlist = async (productId) => {
  const response = await HttpService.post('/wishlist/add', { productId });
  return response.data;
};

export const removeFromWishlist = async (productId) => {
  const response = await HttpService.delete(`/wishlist/${productId}`);
  return response.data;
};

// Order APIs
export const createOrder = async (shippingAddress, paymentMethod) => {
  const response = await HttpService.post('/orders', {
    shippingAddress,
    paymentMethod,
  });
  return response.data;
};

export const getOrderById = async (orderId) => {
  const response = await HttpService.get(`/orders/${orderId}`);
  return response.data;
};

export const getUserOrders = async () => {
  const response = await HttpService.get('/orders');
  return response.data;
};

// Payment APIs
export const createPaymentOrder = async (amount) => {
  const response = await HttpService.post('/payment/create-order', { amount });
  return response.data;
};

export const verifyPayment = async (paymentData) => {
  const response = await HttpService.post('/payment/verify', paymentData);
  return response.data;
};

export default HttpService;

