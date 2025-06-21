import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { IconButton } from '@mui/material';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';

const defaultPosition = [40.7128, -74.0060]; // NYC as default

const resourceIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/854/854878.png',
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28],
});

export default function ResourceMap({ resources, maximized, setMaximized }) {
  const center = resources.length > 0 && resources[0].lat && resources[0].lon
    ? [parseFloat(resources[0].lat), parseFloat(resources[0].lon)]
    : defaultPosition;

  const mapStyle = maximized
    ? {
        height: '60vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1400,
        borderRadius: 0,
      }
    : {
        height: 150,
        width: '100%',
        borderRadius: 5,
        marginBottom: 24,
      };

  return (
    <div>
      <MapContainer center={center} zoom={10} style={mapStyle}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {resources.map((r) => (
          r.lat && r.lon && (
            <Marker
              key={r.id}
              position={[parseFloat(r.lat), parseFloat(r.lon)]}
              icon={resourceIcon}
            >
              <Popup>
                <b>{r.name}</b><br />
                {r.location_name}<br />
                {r.type}
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
      <IconButton
        onClick={() => setMaximized(m => !m)}
        sx={{
          position: 'absolute',
          top: 10,
          right: 10,
          bgcolor: 'rgba(255,255,255,0.92)',
          zIndex: 3000,
          boxShadow: 2,
          '&:hover': { bgcolor: 'rgba(255,255,255,1)' },
        }}
        size="small"
      >
        {maximized ? <CloseFullscreenIcon /> : <OpenInFullIcon />}
      </IconButton>
    </div>
  );
} 