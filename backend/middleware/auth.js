const users = {
  netrunnerX: { role: 'admin' },
  reliefAdmin: { role: 'contributor' },
  citizen1: { role: 'viewer' },
};

module.exports = function mockAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }
  const username = auth.replace('Bearer ', '').trim();
  const user = users[username];
  if (!user) {
    return res.status(403).json({ error: 'Invalid user' });
  }
  req.user = { username, role: user.role };
  next();
}; 