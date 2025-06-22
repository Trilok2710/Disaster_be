import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Tabs, 
  Tab, 
  Box, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText, 
  useTheme, 
  useMediaQuery,
  Typography
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';

export default function Header({ tab, setTab }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleTabChange = (newTab) => {
    setTab(newTab);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const tabLabels = ['Reports', 'Official Updates', 'Social Feed', 'Map'];

  const drawer = (
    <Box sx={{ width: 250, pt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
        <WarningAmberRoundedIcon sx={{ fontSize: 40, color: '#d32f2f', mr: 1 }} />
        <Typography variant="h6" sx={{ color: '#d32f2f', fontWeight: 'bold' }}>
          Disaster Response
        </Typography>
      </Box>
      <List>
        {tabLabels.map((label, index) => (
          <ListItem key={label} disablePadding>
            <ListItemButton
              selected={tab === index}
              onClick={() => handleTabChange(index)}
              sx={{
                mx: 1,
                borderRadius: 2,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(211, 47, 47, 0.1)',
                  color: '#d32f2f',
                  '&:hover': {
                    backgroundColor: 'rgba(211, 47, 47, 0.15)',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <ListItemText 
                primary={label} 
                primaryTypographyProps={{
                  fontWeight: tab === index ? 'bold' : 'normal',
                  fontSize: '1.1rem',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'rgba(255,255,255,0.95)',
          background: 'linear-gradient(90deg, rgba(255,255,255,0.95) 60%, rgba(220,235,255,0.8) 100%)',
          color: '#d32f2f',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
          borderBottom: '1px solid rgba(200,200,200,0.18)',
          minHeight: { xs: 70, md: 80 },
        }}
      >
        <Toolbar sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          minHeight: { xs: 70, md: 80 }, 
          px: { xs: 1, sm: 2 },
          gap: 2
        }}>
          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ 
                mr: 1,
                color: '#d32f2f',
                '&:hover': {
                  backgroundColor: 'rgba(211, 47, 47, 0.1)',
                }
              }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Desktop Tabs - Now on the left */}
          {!isMobile && (
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              variant="standard"
              TabIndicatorProps={{
                style: {
                  height: 5,
                  borderRadius: 3,
                  background: 'linear-gradient(90deg, #d32f2f 0%, #1976d2 100%)',
                  boxShadow: '0 2px 8px #d32f2f33',
                },
              }}
              sx={{
                flex: 1,
                '.MuiTab-root': {
                  fontWeight: 900,
                  fontSize: { md: 16, lg: 18 },
                  color: '#222',
                  minWidth: { md: 100, lg: 120 },
                  letterSpacing: 1,
                  textTransform: 'none',
                  transition: 'color 0.2s',
                  '&:hover': { color: '#1976d2', opacity: 1 },
                },
                '.Mui-selected': { color: '#d32f2f !important' },
              }}
            >
              {tabLabels.map((label) => (
                <Tab key={label} label={label} />
              ))}
            </Tabs>
          )}

          {/* Logo/Title - Now on the right for desktop */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            flex: isMobile ? 1 : 'none',
            minWidth: 0,
            justifyContent: isMobile ? 'flex-start' : 'flex-end'
          }}>
            {!isMobile && (
              <WarningAmberRoundedIcon 
                fontSize="inherit" 
                sx={{ 
                  fontSize: { md: 54, lg: 60 }, 
                  color: '#d32f2f', 
                  filter: 'drop-shadow(0 0 12px #ff1744aa)',
                  mr: 2
                }} 
              />
            )}
            <Typography 
              variant={isMobile ? "h6" : "h5"} 
              sx={{ 
                color: '#d32f2f', 
                fontWeight: 'bold',
                display: { xs: 'none', sm: 'block' },
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              Disaster Response
            </Typography>
          </Box>

          {/* Mobile Current Tab Indicator */}
          {isMobile && (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              flex: 1,
              justifyContent: 'center'
            }}>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  color: '#d32f2f', 
                  fontWeight: 'bold',
                  textAlign: 'center',
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  backgroundColor: 'rgba(211, 47, 47, 0.1)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%'
                }}
              >
                {tabLabels[tab]}
              </Typography>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 250,
            backgroundColor: 'rgba(255,255,255,0.98)',
            backdropFilter: 'blur(16px)',
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
} 