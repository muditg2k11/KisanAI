// utils/api.js
import axios from 'axios';

export default axios.create({
  baseURL: 'http://127.0.0.1:5001',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});