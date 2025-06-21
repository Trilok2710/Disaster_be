import React, { useEffect, useState } from 'react';
import { fetchSocialFeed } from '../api/social';
import { Card, CardHeader, CardContent, Avatar, Typography, Box, CircularProgress, Button, Fade, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

function timeAgo(ts) {
  const now = Date.now();
  const diff = Math.floor((now - ts) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function SocialFeed({ disaster, disasters, onDisasterSelect }) {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!disaster || !disaster.id) {
      setFeed([]);
      setLoading(false);
      return;
    };
    setLoading(true);
    fetchSocialFeed(disaster.id).then(data => {
      setFeed(data);
      setLoading(false);
      setIndex(0);
    }).catch(() => {
      setFeed([]);
      setLoading(false);
    });
  }, [disaster]);

  const handleSelectChange = (event) => {
    const selectedId = event.target.value;
    const newSelectedDisaster = disasters.find(d => d.id === selectedId);
    if (newSelectedDisaster) {
      onDisasterSelect(newSelectedDisaster);
    }
  };

  if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />;

  const post = feed[index];

  return (
    <Box sx={{ my: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>Social Media Feed</Typography>
      
      <FormControl sx={{ mb: 3, minWidth: 280, maxWidth: '80%' }}>
        <InputLabel id="disaster-select-label">Select a Disaster</InputLabel>
        <Select
          labelId="disaster-select-label"
          value={disaster ? disaster.id : ''}
          label="Select a Disaster"
          onChange={handleSelectChange}
        >
          {disasters.map(d => (
            <MenuItem key={d.id} value={d.id}>{d.title}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {!disaster ? (
         <Typography sx={{ textAlign: 'center', my: 4, color: 'text.secondary' }}>Please select a disaster to see the social feed.</Typography>
      ) : !feed.length ? (
        <Typography sx={{ textAlign: 'center', my: 4, color: 'text.secondary' }}>No social media posts found for this disaster.</Typography>
      ) : (
        <Fade in>
          <Card key={post.id} sx={{ borderRadius: 5, boxShadow: 2, minWidth: 320, maxWidth: 500 }}>
            <CardHeader
              avatar={<Avatar src={post.avatar} alt={post.user} />}
              title={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ fontWeight: 'bold' }}>{post.user}</Typography>
                {post.location && (
                  <Typography sx={{ color: 'text.secondary', fontSize: 14, ml: 1 }}>
                    • {post.location}
                  </Typography>
                )}
              </Box>}
              subheader={timeAgo(post.timestamp)}
            />
            <CardContent>
              <Typography variant="body1">{post.content}</Typography>
              {post.image && <img src={post.image} alt="post" style={{ maxWidth: '100%', marginTop: 8, borderRadius: 5 }} />}
            </CardContent>
          </Card>
        </Fade>
      )}

      {post && (
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            sx={{ fontWeight: 'bold', borderRadius: 3 }}
            onClick={() => setIndex(i => i - 1)}
            disabled={index === 0}
          >
            Previous
          </Button>
          <Button
            variant="contained"
            sx={{ fontWeight: 'bold', borderRadius: 3 }}
            onClick={() => setIndex(i => i + 1)}
            disabled={index >= feed.length - 1}
          >
            Next
          </Button>
        </Box>
      )}
    </Box>
  );
} 