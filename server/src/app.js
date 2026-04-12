const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const authRoutes = require('./routes/authRoutes');
const fatwaRoutes = require('./routes/fatwaRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

const allowedOrigins = [env.clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'];
// --- حل الـ CORS المتوافق مع إصدار Express الحديث ---
app.use(cors()); 

// التعديل هنا: نستخدم regex للمسار الشامل بدل النجمة العادية
app.options(/(.*)/, cors()); 
// ----------------------------------------------
// استبدل جزء الـ cors القديم بهذا الكود:
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       // السماح بالطلبات التي ليس لها Origin (مثل تطبيقات الموبايل أو curl)
//       // أو إذا كان الرابط موجود في قائمة المسموح بهم
//       if (!origin || allowedOrigins.includes(origin) || origin.includes('railway.app')) {
//         callback(null, true);
//       } else {
//         callback(new Error('CORS origin is not allowed'));
//       }
//     },
//     credentials: true,
//   })
// );
// app.use(
//   cors({
//     origin(origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//         return callback(null, true);
//       }

//       return callback(new Error('CORS origin is not allowed'));
//     },
//   }),
// );
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/fatwas', fatwaRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);


app.use(notFound);
app.use(errorHandler);

module.exports = app;
