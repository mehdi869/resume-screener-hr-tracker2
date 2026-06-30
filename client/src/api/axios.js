import axios from 'axios';

const api = axios.create({
  baseURL: 'https://resume-screener-hr-tracker2-backend.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
