import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL ;

export async function verifyImage(image_url) {
  try {
    const res = await axios.post(`${API_URL}/verify`, { image_url });
    return res.data;
  } catch (error) {
    console.error("Verification API call failed:", error);
    return { verified: false, reason: 'API error' };
  }
} 