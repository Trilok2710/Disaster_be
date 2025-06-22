import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL ;
const AUTH_HEADER = { Authorization: 'Bearer netrunnerX' };

export async function fetchDisasters() {
  const res = await axios.get(`${API_URL}/disasters`, { headers: AUTH_HEADER });
  return res.data;
} 