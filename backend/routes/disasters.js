const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
const mockAuth = require('../middleware/auth');
const { geocodeLocation } = require('./geocode');

// GET /disasters?tag=flood (public)
router.get('/', async (req, res) => {
  const { tag } = req.query;

  // Call the stored procedure which handles location conversion
  let { data, error } = await supabase.rpc('get_disasters_with_geojson');

  if (error) {
    console.error('Supabase RPC error:', error);
    return res.status(500).json({ error: error.message });
  }

  // If a tag is provided, filter the results on the server.
  if (tag) {
    data = data.filter(d => d.tags && d.tags.includes(tag));
  }

  res.json(data);
});

// Require auth for all below
router.use(mockAuth);

// POST /disasters
router.post('/', async (req, res) => {
  const { title, description, tags } = req.body;
  const owner_id = req.user.username;

  try {
    // Step 1: Geocode the description to get coordinates and location name
    const { lat, lon, location_name } = await geocodeLocation(description);

    if (!lat || !lon) {
      return res.status(400).json({ error: 'Could not geocode a location from the description.' });
    }

    // Step 2: Create the disaster record with the geocoded location
    const location = `POINT(${lon} ${lat})`; // Format for PostGIS
    const audit_trail = [{ action: 'create', user_id: owner_id, timestamp: new Date().toISOString() }];
    
    const { data, error } = await supabase.from('disasters').insert([
      { title, location_name, description, tags, owner_id, audit_trail, location }
    ]).select();

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: error.message });
    }
    
    // Emit Socket.IO event
    req.app.get('io').emit('disaster_updated', { type: 'create', disaster: data[0] });
    res.status(201).json(data[0]);

  } catch (geocodeError) {
    console.error('Geocoding API call failed:', geocodeError.message);
    if (geocodeError.message.includes('Could not extract') || geocodeError.message.includes('Could not find')) {
      return res.status(400).json({ error: geocodeError.message });
    }
    return res.status(500).json({ error: 'An internal server error occurred during geocoding.' });
  }
});

// PUT /disasters/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  // Fetch disaster to check ownership
  const { data: disaster, error: fetchError } = await supabase.from('disasters').select('*').eq('id', id).single();
  if (fetchError || !disaster) return res.status(404).json({ error: 'Disaster not found' });
  if (!(req.user.role === 'admin' || disaster.owner_id === req.user.username)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  // Update audit trail
  const audit_trail = Array.isArray(disaster.audit_trail) ? disaster.audit_trail : [];
  audit_trail.push({ action: 'update', user_id: req.user.username, timestamp: new Date().toISOString() });
  updates.audit_trail = audit_trail;
  const { data, error } = await supabase.from('disasters').update(updates).eq('id', id).select();
  if (error) return res.status(500).json({ error: error.message });
  // Emit Socket.IO event
  req.app.get('io').emit('disaster_updated', { type: 'update', disaster: data[0] });
  res.json(data[0]);
});

// DELETE /disasters/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  // Fetch disaster to check ownership
  const { data: disaster, error: fetchError } = await supabase.from('disasters').select('*').eq('id', id).single();
  if (fetchError || !disaster) return res.status(404).json({ error: 'Disaster not found' });
  if (!(req.user.role === 'admin' || disaster.owner_id === req.user.username)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  // Update audit trail before delete
  const audit_trail = Array.isArray(disaster.audit_trail) ? disaster.audit_trail : [];
  audit_trail.push({ action: 'delete', user_id: req.user.username, timestamp: new Date().toISOString() });
  await supabase.from('disasters').update({ audit_trail }).eq('id', id);
  const { error } = await supabase.from('disasters').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  // Emit Socket.IO event
  req.app.get('io').emit('disaster_updated', { type: 'delete', id });
  res.status(204).send();
});

// DELETE /disasters/all (admin only, delete all disasters)
router.delete('/all', async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: admin only' });
  }
  const { error } = await supabase.from('disasters').delete().gt('id', '');
  if (error) return res.status(500).json({ error: error.message });
  // Emit Socket.IO event
  req.app.get('io').emit('disaster_updated', { type: 'delete_all' });
  res.status(204).send();
});

module.exports = router; 