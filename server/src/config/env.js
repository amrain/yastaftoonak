const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/yastaftoonak',
  jwtSecret: process.env.JWT_SECRET || 'change-me-in-production',
  clientUrl: process.env.CLIENT_URL || 'http://127.0.0.1:5173',
};

module.exports = env;
