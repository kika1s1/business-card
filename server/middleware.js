const fs = require('fs');
const path = require('path');

// Load the database directly
let db = null;
try {
  const dbPath = path.join(__dirname, 'db.json');
  const dbContent = fs.readFileSync(dbPath, 'utf8');
  db = JSON.parse(dbContent);
} catch (error) {
  console.error('Error loading database:', error);
}

module.exports = (req, res, next) => {
  // Add delay to simulate real API
  setTimeout(() => {
    // Handle authentication endpoints
    if (req.path === '/api/auth/login' && req.method === 'POST') {
      const { email, password } = req.body;
      
      // Find user by email from the database
      const users = db?.auth?.users || [];
      const user = users.find(u => u.email === email);
      
      if (user && user.password === password) {
        // Return successful login response
        const token = `jwt-token-${Date.now()}`;
        res.json({
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            subscription: user.subscription,
            createdAt: user.createdAt
          },
          token: token
        });
        return;
      } else {
        res.status(401).json({
          message: 'Invalid email or password'
        });
        return;
      }
    }
    
    // Handle registration endpoint
    if (req.path === '/api/auth/register' && req.method === 'POST') {
      const { firstName, lastName, email, password } = req.body;
      
      const users = db?.auth?.users || [];
      const existingUser = users.find(u => u.email === email);
      
      if (existingUser) {
        res.status(400).json({
          message: 'User with this email already exists'
        });
        return;
      }
      
      // Create new user
      const newUser = {
        id: String(Date.now()),
        firstName,
        lastName,
        email,
        password,
        role: 'user',
        subscription: 'free',
        status: 'active',
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        cardsCount: 0
      };
      
      // Add to database
      db.auth.users.push(newUser);
      
      // Save to file
      try {
        const dbPath = path.join(__dirname, 'db.json');
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
      } catch (error) {
        console.error('Error saving database:', error);
      }
      
      const token = `jwt-token-${Date.now()}`;
      res.json({
        user: {
          id: newUser.id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          role: newUser.role,
          subscription: newUser.subscription,
          createdAt: newUser.createdAt
        },
        token: token
      });
      return;
    }
    
    // Handle me endpoint (get current user)
    if (req.path === '/api/auth/me' && req.method === 'GET') {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'No valid token provided' });
        return;
      }
      
      const token = authHeader.substring(7); // Remove 'Bearer ' prefix
      
      // For demo, validate that token looks like our format
      if (!token.startsWith('jwt-token-')) {
        res.status(401).json({ message: 'Invalid token format' });
        return;
      }
      
      // For demo, return admin user if valid token
      const users = db?.auth?.users || [];
      const user = users.find(u => u.id === '1');
      
      if (user) {
        res.json({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          subscription: user.subscription,
          createdAt: user.createdAt
        });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
      return;
    }
    
    // Handle logout endpoint
    if (req.path === '/api/auth/logout' && req.method === 'POST') {
      res.json({ message: 'Logged out successfully' });
      return;
    }
    
    // Handle admin analytics endpoint
    if (req.path === '/api/admin/analytics' && req.method === 'GET') {
      const analytics = db?.admin?.analytics || {};
      res.json(analytics);
      return;
    }
    
    // Handle admin system metrics endpoint
    if (req.path === '/api/admin/system-metrics' && req.method === 'GET') {
      const systemMetrics = db?.admin?.systemMetrics || {};
      res.json(systemMetrics);
      return;
    }
    
    // Handle admin users endpoint with pagination
    if (req.path === '/api/admin/users' && req.method === 'GET') {
      const { page = 1, limit = 20, search = '' } = req.query;
      
      let users = db?.auth?.users || [];
      
      // Apply search filter
      if (search) {
        users = users.filter(user => 
          user.firstName.toLowerCase().includes(search.toLowerCase()) ||
          user.lastName.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + parseInt(limit);
      const paginatedUsers = users.slice(startIndex, endIndex);
      
      res.json({
        users: paginatedUsers,
        total: users.length,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(users.length / limit)
      });
      return;
    }
    
    // Handle cards endpoint with user filtering
    if (req.path === '/api/cards' && req.method === 'GET') {
      const authHeader = req.headers.authorization;
      
      // For demo, return all cards or filter by user
      let cards = db?.cards || [];
      
      res.json(cards);
      return;
    }
    
    // Handle templates endpoint
    if (req.path === '/api/templates' && req.method === 'GET') {
      const templates = db?.templates || [];
      res.json(templates);
      return;
    }
    
    // Add CORS headers - allow both common Vite ports
    const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
      return;
    }
    
    next();
  }, 300); // 300ms delay to simulate network
}; 