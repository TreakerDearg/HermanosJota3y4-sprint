// src/services/authService.js
import axios from "axios";

const API_URL = import.meta.env.REACT_APP_API_URL; 
// Ej: http://localhost:5000/api

export const loginRequest = async (email, password) => {
  const { data } = await axios.post(`${API_URL}/auth/login`, {
    email,
    password,
  });
  return data.data; // trae token, rol, etc.
};
