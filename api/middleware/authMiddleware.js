const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // bears token

 if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      // don't leak whether it's expired vs malformed vs wrong secret — keep it generic
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = decoded; // { userId, role, iat, exp }
    next();
  });
  
  }

module.exports = authenticateToken;