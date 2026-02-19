const mongoose = require('mongoose');

/**
 * Connect to MongoDB.
 * 
 * Improvements for Easy Deployment:
 * - If MONGODB_URI is missing, we skip connection and return `false`.
 * - This allows the app to fallback to in-memory storage for demo purposes.
 */
const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.warn('⚠️  MONGODB_URI not found in environment variables.');
    console.warn('⚠️  Running in IN-MEMORY MODE (Data will be lost on restart).');
    return false;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    // Do not exit process, let server decide whether to shutdown or run in memory mode
    return false;
  }
};

module.exports = connectDB;
