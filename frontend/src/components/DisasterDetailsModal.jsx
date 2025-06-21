import React, { useState } from 'react';
import { Modal, Box, Typography, Tabs, Tab, IconButton, Fade, Button, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { motion } from 'framer-motion';
import ResourceTab from './ResourceTab';
import ReportTab from './ReportTab';
import DisasterForm from './DisasterForm';
import axios from 'axios';

export default function DisasterDetailsModal({ open, onClose, disaster }) {
  const [tab, setTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);

  if (!disaster) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:4000/disasters/${disaster.id}`, {
        headers: { Authorization: 'Bearer netrunnerX' }
      });
      setSnackbar({ open: true, message: 'Disaster deleted!', severity: 'success' });
      setTimeout(() => {
        setLoading(false);
        setConfirmDelete(false);
        onClose();
      }, 800);
    } catch (e) {
      setSnackbar({ open: true, message: 'Failed to delete disaster.', severity: 'error' });
      setLoading(false);
    }
  };

  const handleUpdate = async (formData) => {
    setLoading(true);
    try {
      await axios.put(`http://localhost:4000/disasters/${disaster.id}`, formData, {
        headers: { Authorization: 'Bearer netrunnerX' }
      });
      setSnackbar({ open: true, message: 'Disaster updated!', severity: 'success' });
      setTimeout(() => {
        setLoading(false);
        setEditMode(false);
        onClose();
      }, 800);
    } catch (e) {
      setSnackbar({ open: true, message: 'Failed to update disaster.', severity: 'error' });
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1300,
        backdropFilter: 'blur(2px)',
      }}
      disableScrollLock={false}
    >
      <Fade in={open}>
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.4 }}
          sx={{
            width: 600,
            maxWidth: '95vw',
            bgcolor: 'rgba(255,255,255,0.95)',
            borderRadius: 8,
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
            p: 3,
            position: 'relative',
            maxHeight: '88vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <IconButton onClick={onClose} sx={{ position: 'absolute', top: 12, right: 12, zIndex: 2 }}>
            <CloseIcon />
          </IconButton>
          {editMode ? (
            <DisasterForm initialData={disaster} onSubmit={handleUpdate} loading={loading} />
          ) : (
            <>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>{disaster.title}</Typography>
              <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1.5 }}>{disaster.location_name}</Typography>
              <Typography variant="body1" sx={{ mb: 1.5 }}>{disaster.description}</Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Button variant="outlined" color="primary" onClick={() => setEditMode(true)} disabled={loading}>Update</Button>
                <Button variant="outlined" color="error" onClick={() => setConfirmDelete(true)} disabled={loading}>Delete</Button>
              </Box>
              <Tabs
                value={tab}
                onChange={(_, v) => setTab(v)}
                sx={{
                  mb: 2,
                  borderBottom: 1,
                  borderColor: 'divider',
                  boxShadow: '0 4px 6px -6px rgba(0,0,0,0.2)',
                }}
              >
                <Tab label="Resources" />
                <Tab label="Reports" />
              </Tabs>
              <Box sx={{
                flex: 1,
                minHeight: 0,
                overflowY: 'auto',
                pr: 2,
                mx: -3,
                px: 3,
                background: 'rgba(0,0,0,0.02)',
                borderTop: '1px solid rgba(0,0,0,0.05)',
                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8,
              }}>
                {tab === 0 && <ResourceTab disaster={disaster} />}
                {tab === 1 && <ReportTab disaster={disaster} />}
              </Box>
            </>
          )}
          <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              Are you sure you want to delete the disaster report <b>{disaster.title}</b>?
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setConfirmDelete(false)} disabled={loading}>Cancel</Button>
              <Button onClick={handleDelete} color="error" disabled={loading}>Delete</Button>
            </DialogActions>
          </Dialog>
          <Snackbar
            open={snackbar.open}
            autoHideDuration={2500}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Box>
      </Fade>
    </Modal>
  );
} 