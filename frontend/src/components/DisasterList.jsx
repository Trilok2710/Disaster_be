import React from 'react';
import { Card, CardContent, Typography, Grid, Chip, Box, Avatar, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded';

export default function DisasterList({ disasters, onDisasterClick, highlightId }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
//   console.log("Disasters data received by list component:", disasters);

  // Sort disasters so the newest (by created_at) is first
  const sortedDisasters = [...disasters].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return (
    <Box sx={{ p: { xs: 1, sm: 2 } }}>
      <Typography
        variant={isMobile ? "h5" : "h4"}
        gutterBottom
        align="center"
        sx={{
          fontWeight: 900,
          color: '#d32f2f',
          letterSpacing: { xs: 1, sm: 2 },
          mb: { xs: 2, sm: 4 },
          textTransform: 'uppercase',
          textShadow: '1px 1px 4px rgba(0,0,0,0.1)',
          px: { xs: 1, sm: 0 },
        }}
      >
        <ReportProblemRoundedIcon sx={{ 
          fontSize: { xs: 28, sm: 36 }, 
          color: '#d32f2f', 
          mr: 1, 
          verticalAlign: 'middle' 
        }} />
        Disaster Reports
      </Typography>
      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} justifyContent="center">
        {sortedDisasters.map((disaster, idx) => (
          <Grid item key={disaster.id} xs={12} sm={6} md={4} lg={3}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.5, type: 'spring' }}
            >
              <Card
                sx={{
                  width: '100%',
                  maxWidth: { xs: '100%', sm: 360, md: 320 },
                  height: { xs: 200, sm: 220, md: 240 },
                  borderRadius: { xs: 4, sm: 7 },
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
                  '&:hover': { 
                    boxShadow: 12, 
                    transform: isMobile ? 'scale(1.02)' : 'scale(1.035)' 
                  },
                }}
                onClick={() => onDisasterClick && onDisasterClick(disaster)}
              >
                <Box sx={{ 
                  pl: { xs: 2, sm: 3 }, 
                  pt: { xs: 2, sm: 3 }, 
                  pr: { xs: 1, sm: 2 }, 
                  flex: 1, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  overflow: 'hidden' 
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar sx={{ 
                      bgcolor: '#d32f2f', 
                      mr: { xs: 1, sm: 2 }, 
                      width: { xs: 32, sm: 40 }, 
                      height: { xs: 32, sm: 40 } 
                    }}>
                      <ReportProblemRoundedIcon sx={{ 
                        color: 'white', 
                        fontSize: { xs: 20, sm: 28 } 
                      }} />
                    </Avatar>
                    <Typography 
                      variant={isMobile ? "subtitle1" : "h6"} 
                      sx={{ 
                        fontWeight: 800, 
                        fontSize: { xs: 16, sm: 18, md: 22 }, 
                        color: '#222', 
                        letterSpacing: 0.5,
                        lineHeight: 1.2
                      }}
                    >
                      {disaster.title}
                    </Typography>
                  </Box>
                  <CardContent sx={{ 
                    pt: 0, 
                    pl: 0, 
                    pr: 0, 
                    pb: { xs: 1, sm: 2 }, 
                    flex: 1, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    overflowY: 'auto' 
                  }}>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      gutterBottom 
                      sx={{ 
                        fontSize: { xs: 13, sm: 15 }, 
                        mb: 1 
                      }}
                    >
                      {disaster.location_name}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        mb: 1, 
                        fontSize: { xs: 14, sm: 16 }, 
                        color: '#333', 
                        lineHeight: 1.7, 
                        flex: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: { xs: 3, sm: 4 },
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {disaster.description}
                    </Typography>
                    <Box sx={{ 
                      display: 'flex', 
                      gap: { xs: 0.5, sm: 1 }, 
                      flexWrap: 'wrap', 
                      mt: 'auto' 
                    }}>
                      {disaster.tags && disaster.tags.map((tag, idx) => (
                        <Chip 
                          key={idx} 
                          label={tag} 
                          color="primary" 
                          size={isMobile ? "small" : "small"}
                          sx={{ 
                            fontSize: { xs: '0.7rem', sm: '0.75rem' },
                            height: { xs: 24, sm: 28 }
                          }}
                        />
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