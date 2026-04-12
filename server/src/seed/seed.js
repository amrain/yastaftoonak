const mongoose = require('mongoose');
const env = require('../config/env');
const User = require('../models/User');
const Fatwa = require('../models/Fatwa');
const Category = require('../models/Category'); // تأكد من وجود الموديل في هذا المسار
const { connectDatabase } = require('../config/db');

async function runSeed() {
  try {
    await connectDatabase();

    // 1. تنظيف البيانات القديمة لضمان عدم التكرار
    await User.deleteMany({});
    await Fatwa.deleteMany({});
    await Category.deleteMany({});
    console.log('🧹 تم تنظيف قاعدة البيانات بنجاح.');

    // 2. إدخال التصنيفات الافتراضية
    const defaultCategories = ['عبادات', 'معاملات', 'فقه الأسرة', 'عقيدة', 'أخرى'];
    await Category.insertMany(defaultCategories.map(name => ({ name })));
    console.log('✅ تم إدخال التصنيفات الافتراضية.');

    // 3. إنشاء المستخدمين (المدير والشيخ)
    const admin = await User.create({
      username: 'admin',
      password: 'admin123',
      name: 'المدير العام',
      role: 'admin',
    });

    const sheikh = await User.create({
      username: 'sheikh1',
      password: '123456',
      name: 'الشيخ أحمد',
      role: 'sheikh',
    });
    console.log('👤 تم إنشاء الحسابات (Admin & Sheikh).');

    // 4. إدخال فتاوى تجريبية مرتبطة بالتصنيفات
    await Fatwa.insertMany([
      {
        name: 'أحمد محمود',
        age: 35,
        gender: 'ذكر',
        location: 'قطاع غزة',
        question: 'ما حكم التجارة في العملات الرقمية؟',
        answer: 'تختلف آراء المعاصرين في العملات الرقمية نظراً لتباين تكييفها الفقهي، والأحوط تجنبها لما فيها من غرر وجهالة شديدة وتقلبات عالية، والله أعلم.',
        category: 'معاملات',
        status: 'published',
        answeredBy: sheikh.name,
        createdAt: new Date('2023-10-25'),
        updatedAt: new Date('2023-10-25'),
      },
      {
        name: 'فاطمة',
        age: 28,
        gender: 'أنثى',
        location: 'الضفة الغربية',
        question: 'نسيت سجدة في الركعة الأخيرة من صلاة العصر، وتذكرت بعد التسليم مباشرة، ماذا أفعل؟',
        answer: 'الحمد لله، إذا كان الفاصل يسيراً، تسجدين السجدة الناقصة، ثم تتشهدين وتسلمين، ثم تسجدين سجدتي السهو وتسلمين. والله أعلم.',
        category: 'عبادات',
        status: 'published',
        answeredBy: sheikh.name,
        createdAt: new Date('2023-10-26'),
        updatedAt: new Date('2023-10-26'),
      },
      {
        name: 'فاعل خير',
        age: 40,
        gender: 'ذكر',
        location: 'الداخل المحتل',
        question: 'هل يجوز إعطاء الزكاة للإخوة إذا كانوا فقراء؟',
        answer: '',
        category: '',
        status: 'new',
        createdAt: new Date('2023-11-01'),
        updatedAt: new Date('2023-11-01'),
      },
    ]);
    console.log('📝 تم إدخال الفتاوى التجريبية.');

    console.log('---');
    console.log(`🚀 تم اكتمال الـ Seed بنجاح على قاعدة البيانات: ${env.mongoUri}`);
    console.log(`🔑 بيانات دخول المدير: admin / admin123`);
    console.log('---');

  } catch (error) {
    console.error('❌ حدث خطأ أثناء عملية الـ Seed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

runSeed();