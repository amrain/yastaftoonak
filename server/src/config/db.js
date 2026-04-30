const mongoose = require('mongoose');
const env = require('./env');

async function connectDatabase() {
  try {
    // نستخدم الرابط من ملف env، وإذا لم يوجد نستخدم process.env مباشرة
    const dbUri = env.mongoUri || process.env.MONGO_URI;

    if (!dbUri) {
      throw new Error("رابط قاعدة البيانات MONGO_URI غير معرف!");
    }

    await mongoose.connect(dbUri);
    console.log(`✅ MongoDB connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error(`❌ Database connection error: ${error.message}`);
    // إنهاء العملية إذا فشل الاتصال بقاعدة البيانات
    process.exit(1); 
  }
}

module.exports = { connectDatabase };