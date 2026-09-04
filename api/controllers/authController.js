const jwt = require('jsonwebtoken');

const token = jwt.sign(
  { userId: user.id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
);

return res.status(200).json({
  message: 'Login successful',
  token,
  user: { id: user.id, name: user.name, role: user.role } // never send the password hash back
});

