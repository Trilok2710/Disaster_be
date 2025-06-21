const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  const { image_url } = req.body;
  if (!image_url) return res.status(400).json({ error: 'image_url required' });
  const isOk = /ok|safe/i.test(image_url);
  res.json({ verified: isOk, reason: isOk ? 'Image is safe' : 'Image failed verification' });
});

module.exports = router; 