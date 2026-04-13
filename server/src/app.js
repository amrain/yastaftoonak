const express = require('express');
const cors = require('cors'); // استدعاء واحد فقط يكفي
const authRoutes = require('./routes/authRoutes');
const fatwaRoutes = require('./routes/fatwaRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

// قائمة الروابط المسموح لها بالوصول
const allowedOrigins = [
  'https://alluring-nourishment-production-1017.up.railway.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

const corsOptions = {
  origin: function (origin, callback) {
    // إذا لم يكن هناك origin (مثل Postman) أو كان localhost أو على railway
    if (!origin || 
        origin.includes('localhost') || 
        origin.includes('127.0.0.1') || 
        origin.endsWith('.railway.app')) {
      callback(null, true);
    } else {
      console.log('❌ CORS blocked:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200 // مهم لبعض المتصفحات القديمة وطلبات الـ OPTIONS
};

// تفعيل الـ CORS كـ middleware أساسي
app.use(cors(corsOptions));

// مهم جداً للتعامل مع طلبات الـ Preflight (OPTIONS)
// بدلاً من النجمة، نستخدم هذا التعبير ليعني "كل المسارات"
app.options(/(.*)/, cors(corsOptions));

// باقي إعدادات السيرفر
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/fatwas', fatwaRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);

// معالجة الأخطاء
app.use(notFound);
app.use(errorHandler);

module.exports = app;
// const express = require('express');
// const cors = require('cors');
// const env = require('./config/env');
// const authRoutes = require('./routes/authRoutes');
// const fatwaRoutes = require('./routes/fatwaRoutes');
// const userRoutes = require('./routes/userRoutes');
// const categoryRoutes = require('./routes/categoryRoutes');
// const { errorHandler, notFound } = require('./middleware/errorHandler');

// const app = express();

// const cors = require('cors');

// const allowedOrigins = [
//   'https://alluring-nourishment-production-1017.up.railway.app',
//   'http://localhost:5173',
//   'http://127.0.0.1:5173',
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     // السماح للطلبات بدون origin (Postman / mobile apps)
//     if (!origin) return callback(null, true);

//     // تنظيف origin من أي trailing slash أو www اختلافات
//     const normalizedOrigin = origin.replace(/\/$/, '');

//     const isAllowed =
//       allowedOrigins.includes(normalizedOrigin) ||
//       origin.includes('railway.app');

//     if (isAllowed) {
//       return callback(null, true);
//     }

//     console.log('❌ Blocked CORS origin:', origin);
//     return callback(new Error('Not allowed by CORS'));
//   },
//   credentials: true,
// }));

// // مهم جدًا للـ preflight
// app.options('*', cors());

// // const allowedOrigins = [env.clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'];
// // // --- حل الـ CORS المتوافق مع إصدار Express الحديث ---
// // app.use(cors()); 

// // // التعديل هنا: نستخدم regex للمسار الشامل بدل النجمة العادية
// // app.options(/(.*)/, cors()); 
// // ----------------------------------------------
// // استبدل جزء الـ cors القديم بهذا الكود:
// // app.use(
// //   cors({
// //     origin: function (origin, callback) {
// //       // السماح بالطلبات التي ليس لها Origin (مثل تطبيقات الموبايل أو curl)
// //       // أو إذا كان الرابط موجود في قائمة المسموح بهم
// //       if (!origin || allowedOrigins.includes(origin) || origin.includes('railway.app')) {
// //         callback(null, true);
// //       } else {
// //         callback(new Error('CORS origin is not allowed'));
// //       }
// //     },
// //     credentials: true,
// //   })
// // );
// // app.use(
// //   cors({
// //     origin(origin, callback) {
// //       if (!origin || allowedOrigins.includes(origin)) {
// //         return callback(null, true);
// //       }

// //       return callback(new Error('CORS origin is not allowed'));
// //     },
// //   }),
// // );
// app.use(express.json());

// app.get('/api/health', (req, res) => {
//   res.json({ status: 'ok' });
// });

// app.use('/api/auth', authRoutes);
// app.use('/api/fatwas', fatwaRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/categories', categoryRoutes);


// app.use(notFound);
// app.use(errorHandler);

// module.exports = app;
