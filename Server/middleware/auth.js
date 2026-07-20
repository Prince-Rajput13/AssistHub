const jwt = require('jsonwebtoken');
const { findUserById } = require('../model/User');

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(authHeader.slice(7), process.env.JWT_SECRET);
    const user = await findUserById(decoded.id);
    if (!user) return res.status(401).json({ error: 'User no longer exists' });

    req.user = user;
    return next();
  } catch (err) {
    return res.status(401).json({
      error: err.name === 'TokenExpiredError' ? 'Token expired, please log in again' : 'Invalid token',
    });
  }
}

module.exports = authMiddleware;
