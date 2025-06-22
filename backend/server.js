require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const http = require('http');
const { Server } = require('socket.io');
const axios = require('axios');

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:5173",
  "https://disaster-be-j9jy.vercel.app",
  "https://disaster-be-m7ge.vercel.app"
];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
  }
});

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Handle preflight requests globally
app.options('*', cors());

app.use(express.json());
app.use(morgan('dev'));

// Make io accessible in routes
app.set('io', io);

// Defensive router mounting
const mountRouter = (path, routerModule) => {
  if (!routerModule) {
    console.error(`[FATAL] Router for path '${path}' is undefined. The module might be missing 'module.exports'.`);
    process.exit(1); // Exit immediately if a router is missing
  }
  app.use(path, routerModule);
};

mountRouter('/disasters', require('./routes/disasters'));
mountRouter('/geocode', require('./routes/geocode').router);
mountRouter('/resources', require('./routes/resources'));
mountRouter('/reports', require('./routes/reports'));
mountRouter('/social', require('./routes/social'));
mountRouter('/official', require('./routes/official'));
mountRouter('/verify', require('./routes/verify'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'up', 
    timestamp: new Date().toISOString() 
  });
});

app.get('/', (req, res) => {
  res.send('Disaster Response Coordination Platform Backend is running.');
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