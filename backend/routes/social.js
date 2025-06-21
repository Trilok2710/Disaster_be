const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

const templates = [
  "SOS! Major {tag} in {location}! We need immediate assistance!",
  "My building in {location} is surrounded by water. Has anyone heard from emergency services? #{tag}",
  "ReliefOrg is setting up a temporary shelter for those affected by the {location} {tag}. Location to follow.",
  "Reports of heavy damage in {location}. Roads are blocked. #disaster #{tag}",
  "Power is out in most of {location}. Please conserve your phone battery.",
  "Urgent need for clean drinking water and food in {location}. Can anyone help? #{tag} #help",
  "Seeing a lot of smoke near downtown {location}. Is there an official update on the {tag}?",
  "All major highways leading out of {location} are closed. Do not attempt to travel. #{tag}",
  "If you are in {location} and need rescue, please put a white cloth on your door.",
  "City Hall in {location} is now operating as an emergency command center for the {tag}."
];

const users = ['RescueOrg', 'JaneDoe', 'CityNews', 'AidWorker', 'WeatherAlert', 'CitizenX', 'LocalGov', 'ReporterJim'];

function generateMockFeed(location, tags) {
  const feed = [];
  const numPosts = 5 + Math.floor(Math.random() * 5); // 5 to 9 posts

  for (let i = 0; i < numPosts; i++) {
    const template = templates[Math.floor(Math.random() * templates.length)];
    const tag = tags[Math.floor(Math.random() * tags.length)] || 'disaster';
    const content = template.replace('{location}', location).replace('{tag}', tag);
    
    feed.push({
      id: i + 1,
      user: users[Math.floor(Math.random() * users.length)],
      avatar: `https://randomuser.me/api/portraits/thumb/${Math.random() > 0.5 ? 'men' : 'women'}/${i}.jpg`,
      content: content,
      timestamp: Date.now() - (i * 1000 * 60 * (Math.random() * 10 + 1)), // a few minutes apart
      location: location,
    });
  }
  return feed;
}

// Route should be something like /social/:disasterId to fetch relevant posts
router.get('/:disasterId', async (req, res) => {
  const { disasterId } = req.params;

  if (!disasterId) {
    return res.status(400).json({ error: 'Disaster ID is required.' });
  }

  // 1. Fetch the disaster details from Supabase
  const { data: disaster, error } = await supabase
    .from('disasters')
    .select('location_name, tags')
    .eq('id', disasterId)
    .single();

  if (error || !disaster) {
    return res.status(404).json({ error: 'Disaster not found.' });
  }
  
  // 2. Generate the mock feed using the disaster's info
  const mockFeed = generateMockFeed(disaster.location_name, disaster.tags);
  
  // 3. Respond with the generated feed
  res.json(mockFeed);
});


module.exports = router;