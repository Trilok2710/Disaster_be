import React from 'react';
import { AppBar, Toolbar, Tabs, Tab, Box } from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';

export default function Header({ tab, setTab }) {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'rgba(255,255,255,0.85)',
        background: 'linear-gradient(90deg, rgba(255,255,255,0.85) 60%, rgba(220,235,255,0.7) 100%)',
        color: '#d32f2f',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
        borderBottom: '1px solid rgba(200,200,200,0.18)',
        minHeight: 80,
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', minHeight: 80, px: 2 }}>
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
              fontSize: 18,
              color: '#222',
              minWidth: 120,
              letterSpacing: 1,
              textTransform: 'none',
              transition: 'color 0.2s',
              '&:hover': { color: '#1976d2', opacity: 1 },
            },
            '.Mui-selected': { color: '#d32f2f !important' },
          }}
        >
          <Tab label="Reports" />
          <Tab label="Official Updates" />
          <Tab label="Social Feed" />
          <Tab label="Map" />
        </Tabs>
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
          <WarningAmberRoundedIcon fontSize="inherit" sx={{ fontSize: 54, color: '#d32f2f', filter: 'drop-shadow(0 0 12px #ff1744aa)' }} />
        </Box>
      </Toolbar>
    </AppBar>
  );
} 