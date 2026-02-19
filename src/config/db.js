const mongoose = require('mongoose');

/**
 * Connect to MongoDB.
 * Uses the URI from environment variables.
 * Exits the process on connection failure — fail-fast in production.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1); // Fail fast — no point running without a DB
  }
};

module.exports = connectDB;
