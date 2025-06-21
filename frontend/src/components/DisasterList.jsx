import React from 'react';
import { Card, CardContent, Typography, Grid, Chip, Box, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded';

export default function DisasterList({ disasters, onDisasterClick, highlightId }) {
  // Sort disasters so the newest (by created_at) is first
  const sortedDisasters = [...disasters].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return (
    <Box sx={{ p: 2 }}>
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{
          fontWeight: 900,
          color: '#d32f2f',
          letterSpacing: 2,
          mb: 4,
          textTransform: 'uppercase',
          textShadow: '1px 1px 4px rgba(0,0,0,0.1)',
        }}
      >
        <ReportProblemRoundedIcon sx={{ fontSize: 36, color: '#d32f2f', mr: 1, verticalAlign: 'middle' }} />
        Disaster Reports
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {sortedDisasters.map((disaster, idx) => (
          <Grid item key={disaster.id}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.5, type: 'spring' }}
            >
              <Card
                sx={{
                  width: 360,
                  height: 220,
                  borderRadius: 7,
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
                  background: 'linear-gradient(120deg, rgba(255,255,255,0.85) 60%, rgba(255,230,230,0.7) 100%)',
                  backdropFilter: 'blur(12px)',
                  borderLeft: '6px solid #d32f2f',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  px: 0,
                  py: 0,
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'box-shadow 0.3s, transform 0.2s',
                  '&:hover': { boxShadow: 12, transform: 'scale(1.035)' },
                }}
                onClick={() => onDisasterClick && onDisasterClick(disaster)}
              >
                <Box sx={{ pl: 3, pt: 3, pr: 2, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar sx={{ bgcolor: '#d32f2f', mr: 2, width: 40, height: 40 }}>
                      <ReportProblemRoundedIcon sx={{ color: 'white', fontSize: 28 }} />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 800, fontSize: 22, color: '#222', letterSpacing: 0.5 }}>
                      {disaster.title}
                    </Typography>
                  </Box>
                  <CardContent sx={{ pt: 0, pl: 0, pr: 0, pb: 2, flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontSize: 15, mb: 1 }}>
                      {disaster.location_name}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1, fontSize: 16, color: '#333', lineHeight: 1.7, flex: 1 }}>{disaster.description}</Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 'auto' }}>
                      {disaster.tags && disaster.tags.map((tag, idx) => (
                        <Chip key={idx} label={tag} color="primary" size="small" />
                      ))}
                    </Box>
                  </CardContent>
                </Box>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
} 