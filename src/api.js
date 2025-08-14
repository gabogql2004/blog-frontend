import axios from 'axios';

// Use env var in production; fall back to localhost for local dev
const baseURL =
  process.env.REACT_APP_API_URL ||
  'http://localhost:5000/api';

export const api = axios.create({ baseURL });
