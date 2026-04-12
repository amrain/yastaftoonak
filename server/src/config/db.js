const mongoose = require('mongoose');
const env = require('./env');

async function connectDatabase() {
  await mongoose.connect(env.mongoUri);
  console.log(`MongoDB connected: ${mongoose.connection.host}`);
}

module.exports = { connectDatabase };
