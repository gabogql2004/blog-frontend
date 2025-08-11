import axios from 'axios';

export const api = axios.create({
    baseURL: 'https://taskmanager-backend-uq6d.onrender.com/api'
})