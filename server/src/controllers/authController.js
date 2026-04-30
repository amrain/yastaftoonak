const User = require('../models/User');
const { signToken } = require('../utils/jwt');

async function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'اسم المستخدم وكلمة المرور مطلوبان.' });
  }

  const user = await User.findOne({ username });

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'بيانات الدخول غير صحيحة.' });
  }

  const token = signToken(user);
  return res.json({ token, user: user.toSafeObject() });
}

async function me(req, res) {
  return res.json({ user: req.user.toSafeObject() });
}

module.exports = { login, me };
