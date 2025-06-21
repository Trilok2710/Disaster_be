import React, { useState } from 'react';
import { Box, TextField, Button, Chip, Stack, Typography, CircularProgress, Fade } from '@mui/material';
import { motion } from 'framer-motion';

export default function DisasterForm({ onSubmit, initialData = {}, loading = false }) {
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
          maxWidth: 500,
          mx: 'auto',
          p: 4,
          background: 'rgba(255,255,255,0.85)',
          borderRadius: 4,
          boxShadow: 4,
          mt: 4,
        }}
      >
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
          {initialData.id ? 'Update Disaster' : 'Create Disaster'}
        </Typography>
        <TextField
          label="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          fullWidth
          multiline
          minRows={3}
          sx={{ mb: 2 }}
        />
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          {tags.map((tag, idx) => (
            <Chip key={idx} label={tag} onDelete={() => setTags(tags.filter(t => t !== tag))} />
          ))}
          <TextField
            label="Add tag"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' ? (e.preventDefault(), handleAddTag()) : null}
            size="small"
            sx={{ width: 100 }}
          />
          <Button variant="outlined" onClick={handleAddTag}>Add</Button>
        </Stack>
        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          disabled={loading || !description}
          sx={{ mt: 2, fontWeight: 'bold' }}
        >
          {loading ? <CircularProgress size={24} /> : (initialData.id ? 'Update' : 'Create')}
        </Button>
      </Box>
    </Fade>
  );
} 