const express = require('express');
const router = express.Router();

const mockUpdates = [
  {
    id: 1,
    title: 'Evacuation Order',
    content: 'Mandatory evacuation for Zone A due to rising floodwaters.',
    timestamp: Date.now() - 1000 * 60 * 60,
    disasterId: 1,
    location_name: 'Zone A',
  },
  {
    id: 2,
    title: 'Shelter Opened',
    content: 'Temporary shelter now open at City High School gym.',
    timestamp: Date.now() - 1000 * 60 * 30,
    disasterId: 1,
    location_name: 'City High School',
  },
  {
    id: 3,
    title: 'Power Outage',
    content: 'Widespread power outage reported in the downtown area.',
    timestamp: Date.now() - 1000 * 60 * 20,
    disasterId: 1,
    location_name: 'Downtown',
  },
  {
    id: 4,
    title: 'Weather Update',
    content: 'Heavy rainfall expected to continue for the next 3 hours.',
    timestamp: Date.now() - 1000 * 60 * 10,
    disasterId: 1,
    location_name: 'Citywide',
  },
  {
    id: 5,
    title: 'All Clear',
    content: 'Floodwaters receding. It is now safe to return to Zone B.',
    timestamp: Date.now() - 1000 * 60 * 2,
    disasterId: 1,
    location_name: 'Zone B',
  },
];

router.get('/', (req, res) => {
  res.json(mockUpdates.slice(-5).reverse());
});

module.exports = router; 