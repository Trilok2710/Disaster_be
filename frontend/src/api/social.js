import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL ;

export async function fetchSocialFeed(disasterId) {
  const res = await axios.get(`${API_URL}/social/${disasterId}`, {
    headers: { Authorization: 'Bearer netrunnerX' }
  });
  return res.data;
} 