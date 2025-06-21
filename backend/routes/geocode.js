const express = require('express');
const axios = require('axios');
const nlp = require('compromise');
const router = express.Router();

router.post('/', async (req, res) => {
  const { description } = req.body;
  if (!description) {
    return res.status(400).json({ error: 'Description is required' });
  }

  try {
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
        return res.status(404).json({ error: 'Could not extract a location name from the text.' });
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
      res.json({ location_name: locationName, lat, lon });
    } else {
      res.status(404).json({ error: `Could not find coordinates for "${locationName}"` });
    }
  } catch (error) {
    console.error('Geocoding error:', error.message);
    res.status(500).json({ error: 'Failed to geocode location due to an internal error.' });
  }
});

module.exports = router; 