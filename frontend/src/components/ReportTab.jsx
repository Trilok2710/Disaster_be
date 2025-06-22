import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Divider, TextField, Button, Stack, CircularProgress, Fade, Chip, Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import axios from 'axios';
import { motion } from 'framer-motion';
import socket from '../socket';
import 'leaflet/dist/leaflet.css';
import { verifyImage } from '../api/verify';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';

function isPriority(content) {
  return /urgent|sos|emergency/i.test(content);
}

const AUTH_HEADER = { Authorization: 'Bearer netrunnerX' };

function VerifiedStatus({ image_url }) {
  const [status, setStatus] = useState(null);
  useEffect(() => {
    let mounted = true;
    verifyImage(image_url).then(res => {
      if (mounted) setStatus(res.verified);
    });
    return () => { mounted = false; };
  }, [image_url]);
  if (status === null) return null;
  return (
    <span style={{
      position: 'absolute',
      top: 2,
      right: 2,
      width: 18,
      height: 18,
      borderRadius: '50%',
      background: status ? '#43a047' : '#d32f2f',
      border: '2px solid #fff',
      boxShadow: '0 0 2px #0002',
      display: 'inline-block',
    }} title={status ? 'Verified OK' : 'Failed Verification'} />
  );
}

export default function ReportTab({ disaster }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ content: '', image_url: '' });
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const [highlightId, setHighlightId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [imageModal, setImageModal] = useState({ open: false, url: '' });
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchReports = () => {
    if (!disaster?.id) return;
    const url = `${import.meta.env.VITE_API_URL}/reports/${disaster.id}`;
    console.log('Fetching reports from:', url);
    console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
    axios.get(url, AUTH_HEADER)
    .then(res => {
      console.log('Reports fetched successfully:', res.data);
      setReports(res.data);
      setLoading(false);
    })
    .catch((error) => {
      console.error('Error fetching reports:', error);
      setReports([]);
      setLoading(false);
    })
  };

  useEffect(() => {
    fetchReports();
    // Listen for real-time report updates
    socket.on('report_updated', (event) => {
      if (event.disaster_id === disaster.id) {
        fetchReports();
        if (event?.type === 'create' && event?.report?.id) {
          setHighlightId(event.report.id);
          setSnackbar({ open: true, message: `New report added!`, severity: 'info' });
          setTimeout(() => setHighlightId(null), 2000);
        }
      }
    });
    return () => {
      socket.off('report_updated');
    };
    // eslint-disable-next-line
  }, [disaster]);

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/reports/${confirmDelete.id}`, AUTH_HEADER);
      setSnackbar({ open: true, message: 'Report deleted!', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to delete report.', severity: 'error' });
    } finally {
      setConfirmDelete(null);
    }
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setFormLoading(true);
    setError('');
    try {
      if (!form.content) {
        setError('Content is required.');
        setFormLoading(false);
        return;
      }
      await axios.post(`${import.meta.env.VITE_API_URL}/reports/${disaster.id}`, form, AUTH_HEADER);
      setForm({ content: '', image_url: '' });
    } catch (e) {
      setError('Failed to add report.');
    } finally {
      setFormLoading(false);
    }
  };

  // Sort reports so newest is first
  const sortedReports = [...reports].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return (
    <Fade in>
      <Box>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Reports</Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <List sx={{ mb: 2 }}>
            {sortedReports.length === 0 && <Typography color="text.secondary">No reports yet.</Typography>}
            {sortedReports.map((r, idx) => (
              <motion.div key={r.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                <ListItem
                  divider
                  sx={{
                    bgcolor: highlightId === r.id
                      ? 'linear-gradient(90deg, #1976d2 0%, #fff 100%)'
                      : isPriority(r.content) ? 'rgba(255,0,0,0.08)' : 'inherit',
                    borderLeft: isPriority(r.content) ? '4px solid #d32f2f' : undefined,
                    transition: 'background 1.2s',
                  }}
                >
                  <ListItemText
                    primary={<Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', width: '100%' }}>
                      <Box sx={{ flex: 1, pr: r.image_url ? 2 : 0 }}>
                        {r.content}
                        {isPriority(r.content) && <Chip label="PRIORITY" color="error" size="small" sx={{ ml: 1 }} />}
                      </Box>
                      {r.image_url && (
                        <Box sx={{ minWidth: 180, maxWidth: 220, ml: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                          <span style={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }} onClick={() => setImageModal({ open: true, url: r.image_url })}>
                            <img src={r.image_url} alt="report" style={{ width: 180, maxWidth: 220, maxHeight: 160, borderRadius: 8, objectFit: 'cover', boxShadow: '0 2px 8px #0001' }} />
                            <VerifiedStatus image_url={r.image_url} />
                          </span>
                        </Box>
                      )}
                    </Box>}
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
        <Typography variant="subtitle1" sx={{ mb: 1 }}>Add Report</Typography>
        <Box component={motion.form} onSubmit={handleSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
          <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
            <TextField label="Content" name="content" value={form.content} onChange={handleChange} size="small" required sx={{ flex: 2 }} />
            <TextField label="Image URL" name="image_url" value={form.image_url} onChange={handleChange} size="small" sx={{ flex: 2 }} />
          </Stack>
          {error && <Typography color="error" sx={{ mb: 1 }}>{error}</Typography>}
          <Button type="submit" variant="contained" disabled={formLoading} sx={{ fontWeight: 'bold', fontFamily: 'Nunito' }}>
            {formLoading ? <CircularProgress size={20} /> : 'Add Report'}
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
        {/* Image Modal */}
        <Dialog
          open={imageModal.open}
          onClose={() => setImageModal({ open: false, url: '' })}
          maxWidth={false}
          PaperProps={{ sx: { background: 'transparent', boxShadow: 'none', borderRadius: 0, p: 0, m: 0, width: 'auto', height: 'auto', maxWidth: 'none', maxHeight: 'none', overflow: 'visible' } }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100vw', height: '100vh', p: 0, m: 0 }}>
            {imageModal.url && (
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <img src={imageModal.url} alt="report-full" style={{ maxWidth: '90vw', maxHeight: '80vh', objectFit: 'contain', borderRadius: 8, boxShadow: '0 4px 32px #000a', display: 'block' }} />
                <IconButton onClick={() => setImageModal({ open: false, url: '' })} sx={{ position: 'absolute', top: 8, right: 8, color: '#fff', background: 'rgba(0,0,0,0.45)', '&:hover': { background: 'rgba(0,0,0,0.7)' }, zIndex: 10 }}>
                  <CloseIcon fontSize="large" />
                </IconButton>
              </Box>
            )}
          </Box>
        </Dialog>
        {/* Delete Confirmation Dialog */}
        {confirmDelete && (
          <Dialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              <Typography>Are you sure you want to delete this report?</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>"{confirmDelete.content}"</Typography>
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