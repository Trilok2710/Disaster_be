import React, { useEffect, useState, useRef } from 'react';
import { fetchDisasters } from './api/disasters';
import DisasterList from './components/DisasterList';
import DisasterForm from './components/DisasterForm';
import DisasterDetailsModal from './components/DisasterDetailsModal';
import { CircularProgress, Container, Fab, Modal, Box, Snackbar, Alert, Tabs, Tab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import socket from './socket';
import DisasterMap from './components/DisasterMap';
import SocialFeed from './components/SocialFeed';
import OfficialUpdates from './components/OfficialUpdates';
import Header from './components/Header';
import ThemeSwitcher from './components/ThemeSwitcher';
import backgrounds from './themeBackgrounds';
import { calculateDistance } from './utils/geo';

function App() {
  const [disasters, setDisasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedDisaster, setSelectedDisaster] = useState(null);
  const [highlightId, setHighlightId] = useState(null);
  const [bgTheme, setBgTheme] = useState(() => {
    const idx = localStorage.getItem('bgThemeIndex');
    return idx ? parseInt(idx, 10) : 0;
  });
  const [tab, setTab] = useState(0);
  const [isFabHovered, setIsFabHovered] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const reportsRef = useRef();
  const updatesRef = useRef();
  const socialRef = useRef();
  const mapRef = useRef();

  useEffect(() => {
    // On initial load, force scroll to top and prevent browser scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    setTimeout(() => window.scrollTo(0, 0), 10);
  }, []);

  useEffect(() => {
    // Get user location for nearby alerts
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
          setSnackbar({ open: true, message: 'Location access denied. Nearby disaster alerts are disabled.', severity: 'warning' });
        }
      );
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchDisasters()
      .then(data => setDisasters(data))
      .catch(() => setDisasters([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    // Listen for real-time disaster updates
    socket.on('disaster_updated', (event) => {
      fetchDisasters().then(data => {
        setDisasters(data);
        if (event?.type === 'create' && event?.disaster?.id) {
          setHighlightId(event.disaster.id);
          const newDisaster = event.disaster;
          if (userLocation && newDisaster.lat && newDisaster.lon) {
            const distance = calculateDistance(userLocation.lat, userLocation.lon, newDisaster.lat, newDisaster.lon);
            if (distance <= 10) {
              setSnackbar({ open: true, message: `🚨 ALERT: New disaster "${newDisaster.title}" within 10km!`, severity: 'error', autoHideDuration: 10000 });
              const alarm = new Audio('/alarm.mp3');
              alarm.play().catch(e => console.error("Error playing alarm sound:", e));
            } else {
              setSnackbar({ open: true, message: `New disaster: ${newDisaster.title}`, severity: 'info' });
            }
          } else {
            setSnackbar({ open: true, message: `New disaster: ${newDisaster.title}`, severity: 'info' });
          }
          setTimeout(() => setHighlightId(null), 2000);
        }
        if (event?.type === 'delete') {
          setSnackbar({ open: true, message: `A disaster was deleted.`, severity: 'warning' });
        }
        if (event?.type === 'update') {
          setSnackbar({ open: true, message: `Disaster updated: ${event.disaster.title}`, severity: 'success' });
        }
        if (event?.type === 'delete_all') {
          setSnackbar({ open: true, message: `All disasters deleted.`, severity: 'error' });
        }
      });
    });
    return () => {
      socket.off('disaster_updated');
    };
  }, []);

  // Scroll to top of tab content on tab change
  useEffect(() => {
    const refs = [reportsRef, updatesRef, socialRef, mapRef];
    const currentRef = refs[tab];
    if (currentRef && currentRef.current) {
      currentRef.current.scrollTop = 0;
    }
  }, [tab]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCreateDisaster = async (formData) => {
    setFormLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/disasters`, formData, {
        headers: { Authorization: 'Bearer netrunnerX' }
      });
      setSnackbar({ open: true, message: 'Disaster created!', severity: 'success' });
      // Refresh list
      const data = await fetchDisasters();
      setDisasters(data);
      setOpen(false);
    } catch (e) {
      setSnackbar({ open: true, message: 'Failed to create disaster.', severity: 'error' });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDisasterClick = (disaster) => {
    setSelectedDisaster(disaster);
    setDetailsOpen(true);
  };

  const handleDetailsClose = () => {
    setDetailsOpen(false);
    setSelectedDisaster(null);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        background: backgrounds[bgTheme].background,
        transition: 'background 0.7s cubic-bezier(.4,2,.3,1)',
        fontSize: { xs: '0.9rem', sm: '0.96rem' },
        overflowX: 'hidden',
      }}
    >
      <Header tab={tab} setTab={setTab} />
      <Box
        sx={{
          maxWidth: '100%',
          px: 0,
          py: { xs: 1, sm: 2, md: 4 },
          mt: { xs: 1, sm: 2, md: 3 },
        }}
      >
        {tab === 0 && (
          <Box ref={reportsRef}>
            {loading ? (
              <CircularProgress sx={{ display: 'block', mx: 'auto', mt: { xs: 5, sm: 10 } }} />
            ) : (
              <Box sx={{ width: '100%', px: { xs: 0.5, sm: 2, md: 4 } }}>
                <DisasterList disasters={disasters} onDisasterClick={handleDisasterClick} highlightId={highlightId} />
              </Box>
            )}
            <Fab
              color="primary"
              aria-label="add disaster"
              onClick={handleOpen}
              sx={{
                position: 'fixed',
                bottom: { xs: 16, sm: 24, md: 32 },
                right: { xs: 16, sm: 24, md: 32 },
                boxShadow: 6,
                '& .MuiSvgIcon-root': {
                  transition: 'margin-right 0.25s ease',
                },
                zIndex: 1000,
              }}
              onMouseEnter={() => setIsFabHovered(true)}
              onMouseLeave={() => setIsFabHovered(false)}
              variant={isFabHovered ? 'extended' : 'circular'}
            >
              <AddIcon sx={{ mr: isFabHovered ? 1 : 0 }} />
              {isFabHovered && <span style={{ whiteSpace: 'nowrap' }}>Add Disaster</span>}
            </Fab>
            <AnimatePresence>
              {open && (
                <Modal
                  open={open}
                  onClose={handleClose}
                  closeAfterTransition
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Box component={motion.div} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }} transition={{ duration: 0.4 }}>
                    <DisasterForm onSubmit={handleCreateDisaster} loading={formLoading} />
                  </Box>
                </Modal>
              )}
            </AnimatePresence>
            <DisasterDetailsModal open={detailsOpen} onClose={handleDetailsClose} disaster={selectedDisaster} />
            <Snackbar
              open={snackbar.open}
              autoHideDuration={snackbar.autoHideDuration || 3000}
              onClose={() => setSnackbar({ ...snackbar, open: false })}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
                {snackbar.message}
              </Alert>
            </Snackbar>
          </Box>
        )}
        {tab === 1 && (
          <Box ref={updatesRef}>
            <OfficialUpdates />
          </Box>
        )}
        {tab === 2 && (
          <Box ref={socialRef}>
            <SocialFeed disaster={selectedDisaster} disasters={disasters} onDisasterSelect={setSelectedDisaster} />
          </Box>
        )}
        {tab === 3 && (
          <Box
            ref={mapRef}
            sx={{
              mx: { xs: 0.5, sm: 2, md: 4 },
              mt: { xs: 1, sm: 2 },
              borderRadius: { xs: 2, sm: 4 },
              overflow: 'hidden',
              boxShadow: 6,
              height: { xs: '50vh', sm: '55vh', md: '60vh' },
              minHeight: { xs: 300, sm: 350, md: 400 },
            }}
          >
            <DisasterMap disasters={disasters} fullSize={true} />
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default App;
