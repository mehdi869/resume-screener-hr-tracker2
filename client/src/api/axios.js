import axios from 'axios';

const api = axios.create({
  baseURL: 'https://resume-screener-hr-tracker2-backend.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 70000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED' || !error.response) {
      const customError = new Error(
        'Server is starting up... This can take up to 50 seconds on the first request after inactivity (Render free tier cold start). Please wait a moment and try again.'
      );
      customError.isServerWaking = true;
      return Promise.reject(customError);
    }
    return Promise.reject(error);
  }
);

export default api;
