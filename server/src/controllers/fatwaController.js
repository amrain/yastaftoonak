const mongoose = require('mongoose');
const Fatwa = require('../models/Fatwa');
const nodemailer = require('nodemailer'); // استيراد مكتبة النود مايلر

// إعداد مرسل البريد (Transporter) باستخدام المتغيرات البيئية .env
// إعداد مرسل البريد (Transporter) باستخدام المتغيرات البيئية .env
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT, 10) || 587,
  secure: process.env.EMAIL_PORT == 465, // سيكون false تلقائياً إذا كان المنفذ 587
  auth: {
    user: process.env.EMAIL_USER, // بريد الموقع المعتمد للإرسال
    pass: process.env.EMAIL_PASS, // كود التطبيق المولد (App Password)
  },
  tls: {
    rejectUnauthorized: false // 👈 إضافة هذا السطر ضرورية جداً للتجربة محلياً لوكال لمنع حجب الشبكة
  }
});

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
    email,
  });

  return res.status(201).json({
    message: 'تم استلام الفتوى بنجاح.',
    fatwa,
  });
}

// تعديل دالة التحديث لتشمل الإرسال الآلي للإيميل
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
    fatwa.answeredBy = req.user?.name || 'اللجنة الشرعية';
  }
  
  await fatwa.save();

  // جلب بارامتر إرسال الإيميل القادم من الفورنتيند
  const { sendEmail } = req.body;

  if (sendEmail && fatwa.email) {
    const mailOptions = {
      from: `"منصة يستفتونك" <${process.env.EMAIL_USER}>`,
      to: fatwa.email,
      subject: `إجابة طلب الفتوى رقم #${fatwa.serialNumber || fatwa._id}`,
      html: `
        <div style="direction: rtl; text-align: right; font-family: 'Tahoma', 'Segoe UI', sans-serif; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px; max-w: 600px; margin: auto; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
          <h2 style="color: #065f46; border-bottom: 2px solid #a7f3d0; padding-bottom: 10px; margin-top: 0;">السلام عليكم ورحمة الله وبركاته</h2>
          <p style="font-size: 15px; color: #475569; line-height: 1.6;">بخصوص سؤالكم الموقر الوارد إلينا عبر المنصة:</p>
          <div style="background-color: #f8fafc; padding: 15px; border-right: 4px solid #f59e0b; margin: 15px 0; font-style: italic; color: #334155; border-radius: 4px;">
            "${fatwa.question}"
          </div>
          <h3 style="color: #065f46; margin-top: 25px; margin-bottom: 10px;">الجواب الشرعي:</h3>
          <div style="font-size: 16px; line-height: 1.8; color: #1e293b; background-color: #f0fdf4; padding: 20px; border-radius: 12px; border: 1px solid #d1fae5;">
            ${fatwa.answer}
          </div>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;">
          <p style="font-size: 12px; color: #64748b; margin-bottom: 5px;">الجهة المجيبة: ${fatwa.answeredBy}</p>
          <p style="font-size: 13px; color: #059669; font-weight: bold; margin-top: 5px;">نسأل الله لنا ولكم التوفيق والسداد.</p>
        </div>
      `,
    };

    // إرسال الإيميل بشكل غير متزامن في الخلفية لضمان عدم تأخير استجابة الطلب للمستخدم
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('❌ خطأ أثناء إرسال الإيميل:', error);
      } else {
        console.log('✅ تم إرسال الإيميل بنجاح، معرف الرسالة:', info.messageId);
      }
    });
  }

  return res.json({ message: 'تم تحديث الفتوى بنجاح وصياغة الرد.', fatwa });
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
// const mongoose = require('mongoose');
// const Fatwa = require('../models/Fatwa');

// async function listFatwas(req, res) {
//   const isAdmin = Boolean(req.user);
//   const query = {};

//   if (!isAdmin) {
//     query.status = 'published';
//   }

//   if (req.query.status && isAdmin) {
//     query.status = req.query.status;
//   }

//   if (req.query.category) {
//     query.category = req.query.category;
//   }

//   const fatwas = await Fatwa.find(query).sort({ createdAt: -1 });
//   return res.json({ fatwas });
// }

// async function getFatwaById(req, res) {
//   const requestedId = req.params.id;
//   let fatwa = null;

//   if (mongoose.isValidObjectId(requestedId)) {
//     fatwa = await Fatwa.findById(requestedId);
//   }

//   // إذا لم يتم العثور على الفتوى بالـ _id، جرب البحث بالـ serialNumber
//   if (!fatwa) {
//     const serialNumber = parseInt(requestedId, 10);
//     if (!isNaN(serialNumber)) {
//       fatwa = await Fatwa.findOne({ serialNumber });
//     }
//   }

//   if (!fatwa) {
//     return res.status(404).json({ message: 'الفتوى غير موجودة.' });
//   }

//   if (!req.user && fatwa.status !== 'published') {
//     return res.status(404).json({ message: 'الفتوى غير متاحة للعامة.' });
//   }

//   return res.json({ fatwa });
// }

// async function createFatwa(req, res) {
//   const { name, age, gender, location, question, wantsToPublish = true, email = '' } = req.body;

//   if (!age || !gender || !location || !question) {
//     return res.status(400).json({ message: 'بيانات الفتوى الأساسية مطلوبة.' });
//   }

//   const fatwa = await Fatwa.create({
//     name,
//     age,
//     gender,
//     location,
//     question,
//     wantsToPublish,
//     email,
//   });

//   return res.status(201).json({
//     message: 'تم استلام الفتوى بنجاح.',
//     fatwa,
//   });
// }

// async function updateFatwa(req, res) {
//   const fatwa = await Fatwa.findById(req.params.id);

//   if (!fatwa) {
//     return res.status(404).json({ message: 'الفتوى غير موجودة.' });
//   }

//   const allowedFields = ['answer', 'category', 'status', 'answeredBy'];
//   allowedFields.forEach((field) => {
//     if (req.body[field] !== undefined) {
//       fatwa[field] = req.body[field];
//     }
//   });

//   if (!fatwa.answeredBy) {
//     fatwa.answeredBy = req.user.name;
//   }
//   await fatwa.save();

//   return res.json({ message: 'تم تحديث الفتوى بنجاح.', fatwa });
// }

// async function deleteFatwa(req, res) {
//   const fatwa = await Fatwa.findById(req.params.id);

//   if (!fatwa) {
//     return res.status(404).json({ message: 'الفتوى غير موجودة.' });
//   }

//   await fatwa.deleteOne();
//   return res.json({ message: 'تم حذف الفتوى.' });
// }

// async function getFatwaStats(req, res) {
//   const [total, pending, answered, gaza, latestFatwas] = await Promise.all([
//     Fatwa.countDocuments(),
//     Fatwa.countDocuments({ status: 'new' }),
//     Fatwa.countDocuments({ status: { $in: ['published', 'answered'] } }),
//     Fatwa.countDocuments({ location: 'قطاع غزة' }),
//     Fatwa.find().sort({ createdAt: -1 }).limit(5),
//   ]);

//   return res.json({
//     stats: {
//       total,
//       new: pending,
//       answered,
//       gaza,
//     },
//     latestFatwas,
//   });
// }

// module.exports = {
//   listFatwas,
//   getFatwaById,
//   createFatwa,
//   updateFatwa,
//   deleteFatwa,
//   getFatwaStats,
// };
