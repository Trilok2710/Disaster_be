const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
const mockAuth = require('../middleware/auth');

// GET /disasters/:id/reports
router.get('/disasters/:id/reports', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('reports').select('*').eq('disaster_id', id).order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.use(mockAuth);

// POST /disasters/:id/reports
router.post('/disasters/:id/reports', async (req, res) => {
  const { id } = req.params;
  const { content, image_url } = req.body;
  const user_id = req.user.username;
  if (!content) return res.status(400).json({ error: 'Content is required' });
  // Priority detection (bonus)
  let verification_status = 'pending';
  if (/urgent|sos|emergency/i.test(content)) {
    verification_status = 'priority';
  }
  const { data, error } = await supabase.from('reports').insert([{
    disaster_id: id,
    user_id,
    content,
    image_url,
    verification_status
  }]).select();
  if (error) return res.status(500).json({ error: error.message });
  // Emit Socket.IO event
  req.app.get('io').emit('report_updated', { type: 'create', report: data[0], disaster_id: id });
  res.status(201).json(data[0]);
});

// DELETE /reports/:id (protected)
router.delete('/reports/:id', async (req, res) => {
  const { id } = req.params;

  // First, get the disaster_id for the socket event
  const { data: report, error: fetchError } = await supabase.from('reports').select('disaster_id').eq('id', id).single();
  if (fetchError || !report) {
    return res.status(404).json({ error: 'Report not found' });
  }

  const { error: deleteError } = await supabase.from('reports').delete().eq('id', id);
  if (deleteError) {
    return res.status(500).json({ error: deleteError.message });
  }

  // Emit Socket.IO event
  req.app.get('io').emit('report_updated', { type: 'delete', id, disaster_id: report.disaster_id });
  res.status(204).send();
});

module.exports = router;
