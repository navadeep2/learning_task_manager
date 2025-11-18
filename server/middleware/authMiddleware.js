 
// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
if (!token) {
    // Authentication token not found
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  try {
    const SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
    const decoded = jwt.verify(token, SECRET);
// Attach user info to the request
    req.user = { 
      userId: decoded.userId, 
      role: decoded.role 
    };
    next();
  } catch (ex) {
    // Token is invalid or expired
    return res.status(401).json({ success: false, message: 'Invalid token.' });
  }
};

module.exports = authMiddleware;
