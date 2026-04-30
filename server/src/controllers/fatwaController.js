const mongoose = require('mongoose');
const Fatwa = require('../models/Fatwa');

async function listFatwas(req, res) {
  const isAdmin = Boolean(req.user);
  const query = {};

  if (!isAdmin) {
    query.status = 'published';
  }

  if (req.query.status && isAdmin) {
    query.status = req.query.status;
  }

  if (req.query.category) {
    query.category = req.query.category;
  }

  const fatwas = await Fatwa.find(query).sort({ createdAt: -1 });
  return res.json({ fatwas });
}

async function getFatwaById(req, res) {
  const requestedId = req.params.id;
  let fatwa = null;

  if (mongoose.isValidObjectId(requestedId)) {
    fatwa = await Fatwa.findById(requestedId);
  }

  // إذا لم يتم العثور على الفتوى بالـ _id، جرب البحث بالـ serialNumber
  if (!fatwa) {
    const serialNumber = parseInt(requestedId, 10);
    if (!isNaN(serialNumber)) {
      fatwa = await Fatwa.findOne({ serialNumber });
    }
  }

  if (!fatwa) {
    return res.status(404).json({ message: 'الفتوى غير موجودة.' });
  }

  if (!req.user && fatwa.status !== 'published') {
    return res.status(404).json({ message: 'الفتوى غير متاحة للعامة.' });
  }

  return res.json({ fatwa });
}

async function createFatwa(req, res) {
  const { name, age, gender, location, question, wantsToPublish = true, email = '' } = req.body;

  if (!age || !gender || !location || !question) {
    return res.status(400).json({ message: 'بيانات الفتوى الأساسية مطلوبة.' });
  }

  const fatwa = await Fatwa.create({
    name,
    age,
    gender,
    location,
    question,
    wantsToPublish,
    email: wantsToPublish ? '' : email,
  });

  return res.status(201).json({
    message: 'تم استلام الفتوى بنجاح.',
    fatwa,
  });
}

async function updateFatwa(req, res) {
  const fatwa = await Fatwa.findById(req.params.id);

  if (!fatwa) {
    return res.status(404).json({ message: 'الفتوى غير موجودة.' });
  }

  const allowedFields = ['answer', 'category', 'status', 'answeredBy'];
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      fatwa[field] = req.body[field];
    }
  });

  if (!fatwa.answeredBy) {
    fatwa.answeredBy = req.user.name;
  }
  await fatwa.save();

  return res.json({ message: 'تم تحديث الفتوى بنجاح.', fatwa });
}

async function deleteFatwa(req, res) {
  const fatwa = await Fatwa.findById(req.params.id);

  if (!fatwa) {
    return res.status(404).json({ message: 'الفتوى غير موجودة.' });
  }

  await fatwa.deleteOne();
  return res.json({ message: 'تم حذف الفتوى.' });
}

async function getFatwaStats(req, res) {
  const [total, pending, answered, gaza, latestFatwas] = await Promise.all([
    Fatwa.countDocuments(),
    Fatwa.countDocuments({ status: 'new' }),
    Fatwa.countDocuments({ status: { $in: ['published', 'answered'] } }),
    Fatwa.countDocuments({ location: 'قطاع غزة' }),
    Fatwa.find().sort({ createdAt: -1 }).limit(5),
  ]);

  return res.json({
    stats: {
      total,
      new: pending,
      answered,
      gaza,
    },
    latestFatwas,
  });
}

module.exports = {
  listFatwas,
  getFatwaById,
  createFatwa,
  updateFatwa,
  deleteFatwa,
  getFatwaStats,
};
