const User = require('../models/User');

async function listUsers(req, res) {
  const users = await User.find().sort({ createdAt: -1 });
  return res.json({
    users: users.map((user) => user.toSafeObject()),
  });
}

async function createUser(req, res) {
  const { username, password, name, role } = req.body;

  if (!username || !password || !name || !role) {
    return res.status(400).json({ message: 'كل بيانات المستخدم مطلوبة.' });
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(409).json({ message: 'اسم المستخدم مستخدم مسبقاً.' });
  }

  const user = await User.create({ username, password, name, role });
  return res.status(201).json({ message: 'تم إنشاء المستخدم.', user: user.toSafeObject() });
}

async function updateUser(req, res) {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: 'المستخدم غير موجود.' });
  }

  const { username, password, name, role } = req.body;

  if (username) user.username = username;
  if (name) user.name = name;
  if (role) user.role = role;
  if (password) user.password = password;

  await user.save();
  return res.json({ message: 'تم تحديث المستخدم.', user: user.toSafeObject() });
}

async function deleteUser(req, res) {
  if (req.user._id.toString() === req.params.id) {
    return res.status(400).json({ message: 'لا يمكنك حذف حسابك الحالي.' });
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: 'المستخدم غير موجود.' });
  }

  await user.deleteOne();
  return res.json({ message: 'تم حذف المستخدم.' });
}

module.exports = { listUsers, createUser, updateUser, deleteUser };
