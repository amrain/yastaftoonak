const app = require('./app');
const env = require('./config/env');
const { connectDatabase } = require('./config/db');
const { backfillFatwaSerialNumbers } = require('./utils/backfillFatwaSerialNumbers');

// async function startServer() {
//   try {
//     await connectDatabase();
//     app.listen(env.port, () => {
//       console.log(`API server running on http://127.0.0.1:${env.port}`);
//     });
//   } catch (error) {
//     console.error('Failed to start server:', error.message);
//     process.exit(1);
//   }
// }

async function startServer() {
  try {
    await connectDatabase();
    await backfillFatwaSerialNumbers();
    
    const PORT = process.env.PORT || env.port || 5000;

    // أضفنا '0.0.0.0' هنا لربط السيرفر بالعالم الخارجي
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ API server running on port: ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}
startServer();
