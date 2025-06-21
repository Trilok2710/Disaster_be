import React from 'react';
import { Fab, Tooltip } from '@mui/material';
import PaletteIcon from '@mui/icons-material/Palette';

export default function ThemeSwitcher({ themes, current, onThemeChange }) {
  const handleClick = () => {
    const next = (current + 1) % themes.length;
    onThemeChange(next);
    localStorage.setItem('bgThemeIndex', next);
  };
  return (
    <Tooltip title={`Theme: ${themes[current].name}`} placement="right">
      <Fab
        color="primary"
        size="medium"
        onClick={handleClick}
        sx={{
          position: 'fixed',
          bottom: 32,
          left: 32,
          zIndex: 3000,
          boxShadow: 6,
          bgcolor: 'white',
          color: 'primary.main',
          '&:hover': { bgcolor: 'primary.light' },
        }}
        aria-label="Switch theme"
      >
        <PaletteIcon />
      </Fab>
    </Tooltip>
  );
} 