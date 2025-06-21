import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import IconButton from '@mui/material/IconButton';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';

const defaultPosition = [40.7128, -74.0060]; // NYC as default

const disasterIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

export default function DisasterMap({ disasters, fullSize = false }) {
  const [maximized, setMaximized] = useState(false);
  const center = disasters.length > 0 && disasters[0].lat && disasters[0].lon
    ? [parseFloat(disasters[0].lat), parseFloat(disasters[0].lon)]
    : defaultPosition;

  let mapStyle;
  if (fullSize) {
    mapStyle = { height: '100%', width: '100%' };
  } else {
    mapStyle = maximized
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
  }

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <MapContainer center={center} zoom={6} style={mapStyle}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
          zIndex={1}
        />
        {disasters.map((d) => {
          if (d.lat && d.lon) {
            console.log('Rendering disaster:', d.title, 'at', d.lat, d.lon);
          } else {
            console.warn('Disaster missing lat/lon:', d);
          }
          return (
            d.lat && d.lon && (
              <Marker
                key={d.id}
                position={[parseFloat(d.lat), parseFloat(d.lon)]}
                icon={disasterIcon}
                zIndexOffset={1000} // Force marker to be on top
              >
                <Popup>
                  <b>{d.title}</b><br />
                  {d.location_name}
                </Popup>
              </Marker>
            )
          );
        })}
      </MapContainer>
      {!fullSize && (
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
      )}
    </div>
  );
} 