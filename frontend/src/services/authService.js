import axios from 'axios';

const API_URL = '/api/users/';

// Register user
const register = async (userData) => {
  try {
    const response = await axios.post(API_URL, userData);
    const data = response.data;
    
    if (!data.token) {
      throw new Error('No token received from server');
    }
    
    return data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Registration failed';
    console.error('Register API error:', message);
    throw new Error(message);
  }
};

// Login user
const login = async (userData) => {
  try {
    const response = await axios.post(API_URL + 'login', userData);
    const data = response.data;
    
    if (!data.token) {
      throw new Error('No token received from server.');
    }
    
    return data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Login failed';
    console.error('Login API error:', message);
    throw new Error(message);
  }
};

// Logout user
const logout = () => {
  localStorage.removeItem('user');
};

const authService = {
  register,
  logout,
  login,
 
};

export default authService;
