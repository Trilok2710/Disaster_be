const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
const mockAuth = require('../middleware/auth');

// GET /disasters/:id/resources (public)
router.get('/disasters/:id/resources', async (req, res) => {
  const { id } = req.params;
  // Use the Supabase function to get resources with lat/lon
  const { data, error } = await supabase.rpc('get_resources_with_geojson', { p_disaster_id: id });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.use(mockAuth);

// POST /disasters/:id/resources (protected)
router.post('/disasters/:id/resources', async (req, res) => {
  const { id } = req.params;
  const { name, location_name, type, lat, lon } = req.body;
  if (!name || !lat || !lon) return res.status(400).json({ error: 'Name, lat, and lon are required' });
  const { data, error } = await supabase.from('resources').insert([{
    disaster_id: id,
    name,
    location_name,
    type,
    location: `SRID=4326;POINT(${lon} ${lat})`
  }]).select();
  if (error) return res.status(500).json({ error: error.message });
  // Emit Socket.IO event
  req.app.get('io').emit('resource_updated', { type: 'create', resource: data[0], disaster_id: id });
  res.status(201).json(data[0]);
});

// DELETE /resources/:id (protected)
router.delete('/resources/:id', async (req, res) => {
  const { id } = req.params;
  
  // First, get the disaster_id for the socket event
  const { data: resource, error: fetchError } = await supabase.from('resources').select('disaster_id').eq('id', id).single();
  if (fetchError || !resource) {
    return res.status(404).json({ error: 'Resource not found' });
  }

  const { error: deleteError } = await supabase.from('resources').delete().eq('id', id);
  if (deleteError) {
    return res.status(500).json({ error: deleteError.message });
  }

  // Emit Socket.IO event
  req.app.get('io').emit('resource_updated', { type: 'delete', id, disaster_id: resource.disaster_id });
  res.status(204).send();
});

module.exports = router;
