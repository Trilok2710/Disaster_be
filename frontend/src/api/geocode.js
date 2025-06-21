import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const AUTH_HEADER = { Authorization: 'Bearer netrunnerX' };

export async function extractAndGeocodeLocation(description) {
  const res = await axios.post(
    `${API_URL}/geocode`,
    { description },
    { headers: AUTH_HEADER }
  );
  return res.data; // { location_name, lat, lon }
}

export async function geocode(description) {
  const res = await axios.post(`${API_URL}/geocode`, { description });
  return res.data;
} 