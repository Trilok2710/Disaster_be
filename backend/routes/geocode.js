const express = require('express');
const axios = require('axios');
const nlp = require('compromise');
const router = express.Router();

// Extract geocoding logic into a reusable function
async function geocodeLocation(description) {
  if (!description) {
    throw new Error('Description is required');
  }

  // 1. Extract location name using compromise NLP
  let doc = nlp(description);
  let locations = doc.places().out('array');
  let locationName = locations.length > 0 ? locations[0] : null;
  
  if (!locationName) {
      // Simple fallback: check for "in [location]"
      const inMatch = description.match(/in ([\w\s]+)/i);
      if (inMatch && inMatch[1]) {
          locationName = inMatch[1].trim();
      }
  }
  
  if (!locationName) {
      throw new Error('Could not extract a location name from the text.');
  }

  // 2. Geocode the location name using OpenStreetMap's Nominatim API
  const geoRes = await axios.get('https://nominatim.openstreetmap.org/search', {
    params: {
      q: locationName,
      format: 'json',
      limit: 1
    },
    headers: {
      'User-Agent': 'CityMallDisasterApp/1.0' // Nominatim requires a User-Agent
    }
  });

  // 3. Return the dynamic coordinates
  if (geoRes.data && geoRes.data.length > 0) {
    const { lat, lon } = geoRes.data[0];
    return { location_name: locationName, lat, lon };
  } else {
    throw new Error(`Could not find coordinates for "${locationName}"`);
  }
}

router.post('/', async (req, res) => {
  const { description } = req.body;
  
  try {
    const result = await geocodeLocation(description);
    res.json(result);
  } catch (error) {
    console.error('Geocoding error:', error.message);
    if (error.message.includes('Could not extract') || error.message.includes('Could not find')) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to geocode location due to an internal error.' });
    }
  }
});

module.exports = { router, geocodeLocation }; 