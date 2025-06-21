import React from 'react';
import { fetchOfficialUpdates } from '../api/official';
import { Typography, Box, CircularProgress, Button, Paper, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import RoomIcon from '@mui/icons-material/Room';

function timeAgo(ts) {
  const now = Date.now();
  const diff = Math.floor((now - ts) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const UpdateCard = ({ update }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: 'easeOut' }}
    style={{ width: '100%' }}
  >
    <Paper
      elevation={3}
      sx={{
        p: 2.5,
        background: 'linear-gradient(120deg, rgba(255,255,255,0.97) 70%, rgba(220,235,255,0.7) 100%)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(200, 220, 255, 0.18)',
        borderRadius: 6,
        boxShadow: '0 4px 24px 0 rgba(31, 38, 135, 0.10)',
        width: '100%',
        maxWidth: 720,
        minWidth: 320,
        minHeight: 170,
        display: 'flex',
        flexDirection: 'column',
        alignSelf: 'center',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#1976d2', fontSize: 20, letterSpacing: 0.2, flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{update.title}</Typography>
        {update.location_name && (
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
            <RoomIcon sx={{ fontSize: 16, color: '#1976d2', mr: 0.3 }} />
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#1976d2', fontSize: 13, opacity: 0.85, whiteSpace: 'nowrap' }}>
              {update.location_name}
            </Typography>
          </Box>
        )}
      </Box>
      <Typography variant="caption" sx={{ color: '#888', fontWeight: 600, mb: 0.5, display: 'block', fontSize: 13 }}>
        {timeAgo(update.timestamp)}
      </Typography>
      <Box sx={{ width: '100%', my: 1 }}>
        <Box sx={{ borderBottom: '1.5px solid #e3eafc', width: '100%' }} />
      </Box>
      <Typography variant="body1" sx={{ color: '#222', lineHeight: 1.7, fontSize: 16, fontWeight: 500, flex: 1, mt: 0.5 }}>{update.content}</Typography>
    </Paper>
  </motion.div>
);

export default function OfficialUpdates() {
  const [updates, setUpdates] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [expanded, setExpanded] = React.useState(false);

  React.useEffect(() => {
    fetchOfficialUpdates().then(data => {
      setUpdates(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />;
  if (!updates.length) return null;

  const visibleUpdates = expanded ? updates : updates.slice(0, 2);

  return (
    <Box sx={{ my: 5, px: { xs: 1, sm: 2 }, pb: 6, overflowX: 'hidden' }}>
      <Typography variant="h4" sx={{ textAlign: 'center', mb: 4, fontWeight: 900, letterSpacing: 1, color: '#000', textTransform: 'uppercase', textShadow: '2px 2px 8px rgba(0,0,0,0.3)' }}>
        Official Updates
      </Typography>
      <Grid container spacing={2} sx={{ width: '100%', margin: 0 }} alignItems="stretch" justifyContent="center">
        {visibleUpdates.map((update, idx) => (
          <Grid item xs={12} md={6} key={update.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', p: 0, m: 0 }}>
            <UpdateCard update={update} />
          </Grid>
        ))}
      </Grid>
      {updates.length > 2 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="contained"
            sx={{
              borderRadius: 99,
              fontWeight: 'bold',
              fontSize: 18,
              px: 5,
              py: 1.5,
              letterSpacing: 1,
              bgcolor: 'linear-gradient(90deg, #1976d2 0%, #64b5f6 100%)',
              color: '#fff',
              boxShadow: '0 4px 16px 0 rgba(25, 118, 210, 0.10)',
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: 'linear-gradient(90deg, #1565c0 0%, #1976d2 100%)',
                color: '#fff',
                boxShadow: '0 8px 32px 0 rgba(25, 118, 210, 0.18)',
                transform: 'scale(1.04)',
              },
            }}
            onClick={() => setExpanded(e => !e)}
          >
            {expanded ? 'Show Less' : 'Show More'}
          </Button>
        </Box>
      )}
    </Box>
  );
} 