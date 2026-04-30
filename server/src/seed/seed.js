const mongoose = require('mongoose');
const env = require('../config/env');
const User = require('../models/User');
const Fatwa = require('../models/Fatwa');
const Category = require('../models/Category'); // تأكد من وجود الموديل في هذا المسار
const Counter = require('../models/Counter');
const { FATWA_SERIAL_COUNTER_ID } = require('../utils/counters');
const { connectDatabase } = require('../config/db');

async function runSeed() {
  try {
     await connectDatabase();
    // await mongoose.connect("mongodb+srv://abd3mrain_db_user:SrIXA19w45U5cgln@yastaftoonak-cluster.phprhle.mongodb.net/yastaftoonak");

    // 1. تنظيف البيانات القديمة لضمان عدم التكرار
    await User.deleteMany({});
    await Fatwa.deleteMany({});
    await Category.deleteMany({});
    await Counter.deleteOne({ _id: FATWA_SERIAL_COUNTER_ID });
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

    // 4. إدخال فتاوى تجريبية (مع أرقام تسلسلية تلقائية)
    const seedFatwas = [
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
        name: 'محمد',
        age: 32,
        gender: 'ذكر',
        location: 'الضفة الغربية',
        question: 'هل يجوز إخراج زكاة الفطر نقداً؟',
        answer:
          'الأصل إخراجها طعاماً كما ورد في السنة، وأجاز بعض أهل العلم إخراجها نقداً للحاجة والمصلحة. والأحوط إخراجها طعاماً، والله أعلم.',
        category: 'عبادات',
        status: 'published',
        answeredBy: sheikh.name,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10'),
      },
      {
        name: 'سائلة',
        age: 24,
        gender: 'أنثى',
        location: 'خارج فلسطين',
        question: 'ما حكم قراءة الفاتحة للمأموم خلف الإمام في الصلاة الجهرية؟',
        answer:
          'في المسألة خلاف مشهور، والراجح أن المأموم يقرأ الفاتحة في السرية، وأما الجهرية فيقرأها في سكتات الإمام إن تيسر، وإلا فالإنصات مقدم. والله أعلم.',
        category: 'عبادات',
        status: 'published',
        answeredBy: sheikh.name,
        createdAt: new Date('2024-02-05'),
        updatedAt: new Date('2024-02-05'),
      },
      {
        name: 'فاعل خير',
        age: 40,
        gender: 'ذكر',
        location: 'الداخل المحتل',
        question: 'هل يجوز إعطاء الزكاة للإخوة إذا كانوا فقراء؟',
        answer: '',
        category: 'معاملات',
        status: 'new',
        wantsToPublish: true,
        createdAt: new Date('2026-04-20'),
        updatedAt: new Date('2026-04-20'),
      },
    ];

    const created = [];
    for (const doc of seedFatwas) {
      // eslint-disable-next-line no-await-in-loop
      created.push(await Fatwa.create(doc));
    }
    console.log('📝 تم إدخال الفتاوى التجريبية.');
    console.log('🔢 أرقام الفتاوى:', created.map((fatwa) => fatwa.serialNumber).join(', '));

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
