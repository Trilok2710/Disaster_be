import React, { useEffect, useState } from 'react';
import { Dialog, DialogActions, DialogTitle, DialogContent, Box, Typography, List, ListItem, ListItemText, Divider, TextField, Button, Stack, CircularProgress, Fade, Snackbar, Alert, IconButton, Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { motion } from 'framer-motion';
import socket from '../socket';

export default function ResourceTab({ disaster }) {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', location_name: '', type: '', lat: '', lon: '' });
  const [formLoading, setFormLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [error, setError] = useState('');
  const [highlightId, setHighlightId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [mapMaximized, setMapMaximized] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchResources = () => {
    if (!disaster?.id) return;
    axios.get(`${import.meta.env.VITE_API_URL}/resources/${disaster.id}`, {
      headers: AUTH_HEADER
    })
    .then(res => setResources(res.data))
    .catch(() => setResources([]))
  };

  useEffect(() => {
    fetchResources();
    // Listen for real-time resource updates
    socket.on('resource_updated', (event) => {
      if (event.disaster_id === disaster.id) {
        fetchResources();
        if (event?.type === 'create' && event?.resource?.id) {
          setHighlightId(event.resource.id);
          setSnackbar({ open: true, message: `New resource: ${event.resource.name}`, severity: 'info' });
          setTimeout(() => setHighlightId(null), 2000);
        }
      }
    });
    return () => {
      socket.off('resource_updated');
    };
    // eslint-disable-next-line
  }, [disaster]);

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/resources/${confirmDelete.id}`, {
        headers: { Authorization: 'Bearer netrunnerX' }
      });
      setSnackbar({ open: true, message: 'Resource deleted!', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to delete resource.', severity: 'error' });
    } finally {
      setConfirmDelete(null);
    }
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleExtractLocation = async () => {
    setExtracting(true);
    setError('');
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/geocode`, { description: form.location_name });
      setForm(f => ({ ...f, lat: res.data.lat, lon: res.data.lon }));
    } catch (e) {
      setError('Could not extract coordinates for this location.');
    } finally {
      setExtracting(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setFormLoading(true);
    setError('');
    try {
      if (!form.name || !form.location_name || !form.lat || !form.lon) {
        setError('Name, location, and extracted coordinates are required.');
        setFormLoading(false);
        return;
      }
      await axios.post(`${import.meta.env.VITE_API_URL}/resources/${disaster.id}`, form, {
        headers: AUTH_HEADER
      });
      setForm({ name: '', location_name: '', type: '', lat: '', lon: '' });
    } catch (e) {
      setError('Failed to add resource.');
    } finally {
      setFormLoading(false);
    }
  };

  // Sort resources so newest is first
  const sortedResources = [...resources].sort((a, b) => {
    // Prioritize nearby resources, then sort by newest
    if (a.is_nearby !== b.is_nearby) {
      return a.is_nearby ? -1 : 1;
    }
    return new Date(b.created_at) - new Date(a.created_at);
  });

  return (
    <Fade in>
      <Box sx={{ minHeight: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {loading ? (
          <CircularProgress />
        ) : (
          <List sx={{ mb: 2, flex: 1, minHeight: 0, overflowY: 'auto' }}>
            {sortedResources.length === 0 && <Typography color="text.secondary">No resources yet.</Typography>}
            {sortedResources.map((r, idx) => (
              <motion.div key={r.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                <ListItem
                  divider
                  sx={{
                    bgcolor: r.is_nearby
                      ? 'rgba(76, 175, 80, 0.15)'
                      : highlightId === r.id
                      ? 'linear-gradient(90deg, #388e3c 0%, #fff 100%)'
                      : 'inherit',
                    borderLeft: r.is_nearby ? '4px solid #4caf50' : 'none',
                    transition: 'all 0.5s',
                  }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <b>{r.name}</b>
                        <span style={{ color: '#1976d2' }}>{r.type}</span>
                        {r.is_nearby && <Chip label="Nearby" color="success" size="small" variant="outlined" />}
                      </Box>
                    }
                    secondary={<>{r.location_name} ({r.lat}, {r.lon})</>}
                  />
                  <IconButton edge="end" aria-label="delete" onClick={() => setConfirmDelete(r)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              </motion.div>
            ))}
          </List>
        )}
        <Divider sx={{ mb: 2 }} />
        <Typography variant="subtitle1" sx={{ mb: 1 }}>Add Resource</Typography>
        <Box component={motion.form} onSubmit={handleSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
          <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
            <TextField label="Name" name="name" value={form.name} onChange={handleChange} size="small" required sx={{ flex: 1 }} />
            <TextField label="Type" name="type" value={form.type} onChange={handleChange} size="small" sx={{ flex: 1 }} />
          </Stack>
          <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
            <TextField label="Location Name" name="location_name" value={form.location_name} onChange={handleChange} size="small" sx={{ flex: 1 }} />
            <Button
              variant="outlined"
              size="small"
              onClick={handleExtractLocation}
              disabled={extracting || !form.location_name}
              sx={{ minWidth: 120 }}
            >
              {extracting ? <CircularProgress size={18} /> : 'Extract Location'}
            </Button>
          </Stack>
          {form.lat && form.lon && (
            <Typography sx={{ color: 'green', fontSize: 14, mb: 1 }}>
              Extracted: ({form.lat}, {form.lon})
            </Typography>
          )}
          {error && <Typography color="error" sx={{ mb: 1 }}>{error}</Typography>}
          <Button type="submit" variant="contained" disabled={formLoading} sx={{ fontWeight: 'bold', fontFamily: 'Nunito' }}>
            {formLoading ? <CircularProgress size={20} /> : 'Add Resource'}
          </Button>
        </Box>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
        {confirmDelete && (
          <Dialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              <Typography>Are you sure you want to delete the resource: <b>{confirmDelete.name}</b>?</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setConfirmDelete(null)}>Cancel</Button>
              <Button onClick={handleDelete} color="error">Delete</Button>
            </DialogActions>
          </Dialog>
        )}
      </Box>
    </Fade>
  );
} 