// API Configuration
export const API_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://your-backend-url.railway.app'  // Update this with your Railway backend URL
    : 'http://localhost:8000');

export const config = {
  apiUrl: API_URL,
  requestTimeout: 10000,
  imageQuality: 0.6,
  requestInterval: 3000,
};
