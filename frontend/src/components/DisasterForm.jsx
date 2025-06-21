import React, { useState } from 'react';
import { Box, TextField, Button, Chip, Stack, Typography, CircularProgress, Fade, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';

export default function DisasterForm({ onSubmit, initialData = {}, loading = false }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [title, setTitle] = useState(initialData.title || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [tags, setTags] = useState(initialData.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState('');

  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description) {
      setError('Title and description are required.');
      return;
    }
    onSubmit({ title, description, tags });
  };

  return (
    <Fade in>
      <Box
        component={motion.form}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit}
        sx={{
          maxWidth: { xs: '95vw', sm: 500 },
          width: { xs: '95vw', sm: 500 },
          mx: 'auto',
          p: { xs: 2, sm: 3, md: 4 },
          background: 'rgba(255,255,255,0.95)',
          borderRadius: { xs: 2, sm: 4 },
          boxShadow: 4,
          mt: { xs: 2, sm: 4 },
          backdropFilter: 'blur(16px)',
        }}
      >
        <Typography 
          variant={isMobile ? "h6" : "h5"} 
          sx={{ 
            mb: { xs: 1.5, sm: 2 }, 
            fontWeight: 'bold',
            textAlign: 'center'
          }}
        >
          {initialData.id ? 'Update Disaster' : 'Create Disaster'}
        </Typography>
        <TextField
          label="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          fullWidth
          size={isMobile ? "small" : "medium"}
          sx={{ mb: { xs: 1.5, sm: 2 } }}
        />
        <TextField
          label="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          fullWidth
          multiline
          minRows={isMobile ? 2 : 3}
          size={isMobile ? "small" : "medium"}
          sx={{ mb: { xs: 1.5, sm: 2 } }}
        />
        <Stack 
          direction={isMobile ? "column" : "row"} 
          spacing={isMobile ? 1 : 1} 
          sx={{ mb: { xs: 1.5, sm: 2 } }}
        >
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: { xs: 0.5, sm: 1 },
            mb: isMobile ? 1 : 0
          }}>
            {tags.map((tag, idx) => (
              <Chip 
                key={idx} 
                label={tag} 
                onDelete={() => setTags(tags.filter(t => t !== tag))}
                size={isMobile ? "small" : "medium"}
              />
            ))}
          </Box>
          <Stack direction={isMobile ? "row" : "row"} spacing={1} sx={{ flex: 1 }}>
            <TextField
              label="Add tag"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' ? (e.preventDefault(), handleAddTag()) : null}
              size={isMobile ? "small" : "small"}
              sx={{ 
                width: isMobile ? '60%' : 100,
                flex: isMobile ? 1 : 'none'
              }}
            />
            <Button 
              variant="outlined" 
              onClick={handleAddTag}
              size={isMobile ? "small" : "medium"}
              sx={{ 
                width: isMobile ? '40%' : 'auto',
                minWidth: isMobile ? 'auto' : 80
              }}
            >
              Add
            </Button>
          </Stack>
        </Stack>
        {error && (
          <Typography 
            color="error" 
            sx={{ 
              mb: { xs: 1.5, sm: 2 },
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}
          >
            {error}
          </Typography>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size={isMobile ? "medium" : "large"}
          disabled={loading || !description}
          sx={{ 
            mt: { xs: 1.5, sm: 2 }, 
            fontWeight: 'bold',
            py: { xs: 1, sm: 1.5 }
          }}
        >
          {loading ? <CircularProgress size={isMobile ? 20 : 24} /> : (initialData.id ? 'Update' : 'Create')}
        </Button>
      </Box>
    </Fade>
  );
} 