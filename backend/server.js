require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const http = require('http');
const { Server } = require('socket.io');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173"
}));
app.use(express.json());
app.use(morgan('dev'));

// Make io accessible in routes
app.set('io', io);

const disastersRouter = require('./routes/disasters');
app.use('/disasters', disastersRouter);

const geocodeRouter = require('./routes/geocode');
app.use('/geocode', geocodeRouter);

const resourcesRouter = require('./routes/resources');
app.use('/', resourcesRouter);

const reportsRouter = require('./routes/reports');
app.use('/', reportsRouter);

const socialRoutes = require('./routes/social');
app.use('/social', socialRoutes);

const officialRoutes = require('./routes/official');
app.use('/official', officialRoutes);

const verifyRoutes = require('./routes/verify');
app.use('/verify', verifyRoutes);

app.get('/', (req, res) => {
  res.send('Disaster Response Coordination Platform Backend is running.');
});

app.get('/geocode', async (req, res) => {
  const { location } = req.query;
  try {
    const coords = await geocodeWithNominatim(location);
    res.json(coords);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = { app, io };

async function geocodeWithNominatim(locationName) {
  const url = 'https://nominatim.openstreetmap.org/search';
  const params = {
    q: locationName,
    format: 'json',
    addressdetails: 1,
    limit: 1,
  };
  const headers = {
    'User-Agent': 'Disaster Response Coordination Platform/1.0 (trilokchandpanchal@email.com)', // Nominatim requires a valid User-Agent
  };
  const response = await axios.get(url, { params, headers });
  if (response.data && response.data.length > 0) {
    const { lat, lon } = response.data[0];
    return { lat, lon };
  }
  return null;
}

async function testGeocode() {
  const coords = await geocodeWithNominatim('Manhattan, NYC');
  console.log(coords);
}

testGeocode(); 