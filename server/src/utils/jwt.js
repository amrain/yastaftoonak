const jwt = require('jsonwebtoken');
const env = require('../config/env');

function signToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
      username: user.username,
      name: user.name,
    },
    env.jwtSecret,
    { expiresIn: '7d' },
  );
}

module.exports = { signToken };
