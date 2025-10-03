const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Public routes that don't require authentication
const publicRoutes = [
  '/api/auth/login',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
  '/api/properties',
  '/api/properties/query',
  '/api/properties/near',
  '/api/properties/adress',
  '/api/properties/lastsix',
  '/api/properties/piechart',
  '/api/properties/categories',
  '/api/properties/count',
  '/api/properties/yearlistings',
  '/api/messages',
  '/api/track-view',
  '/api/feature-options',
  '/health'
];

// Check if route is public
const isPublicRoute = (path) => {
  return publicRoutes.some(route => {
    if (route.includes(':')) {
      // Handle dynamic routes
      const routeRegex = new RegExp('^' + route.replace(/:\w+/g, '[^/]+') + '$');
      return routeRegex.test(path);
    }
    return path.startsWith(route);
  });
};

// JWT authentication middleware
const authenticateToken = async (req, res, next) => {
  // Skip authentication for public routes
  if (isPublicRoute(req.path)) {
    return next();
  }

  const token = req.cookies?.accessToken;

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.sub);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = {
      userId: user._id.toString(),
      email: user.email,
      roles: user.roles
    };
    
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Role-based authorization middleware
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.roles)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRoles
};