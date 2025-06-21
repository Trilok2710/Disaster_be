import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function fetchOfficialUpdates() {
  const res = await axios.get(`${API_URL}/official`, {
    headers: { Authorization: 'Bearer netrunnerX' }
  });
  return res.data;
} 