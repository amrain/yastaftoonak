const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/User');

async function requireAuth(req, res, next) {
  try {
    const token = extractBearerToken(req);

    if (!token) {
      return res.status(401).json({ message: 'غير مصرح. سجّل الدخول أولاً.' });
    }

    const payload = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(payload.sub);

    if (!user) {
      return res.status(401).json({ message: 'المستخدم غير موجود.' });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'رمز الدخول غير صالح.' });
  }
}

async function optionalAuth(req, res, next) {
  try {
    const token = extractBearerToken(req);

    if (!token) {
      return next();
    }

    const payload = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(payload.sub);

    if (user) {
      req.user = user;
    }

    return next();
  } catch (error) {
    return next();
  }
}

function extractBearerToken(req) {
  const authHeader = req.headers.authorization || '';
  const [, token] = authHeader.split(' ');
  return token;
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'ليس لديك صلاحية لهذا الإجراء.' });
    }

    return next();
  };
}

module.exports = { requireAuth, optionalAuth, requireRole };
