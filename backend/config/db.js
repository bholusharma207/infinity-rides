const mongoose = require('mongoose');
const dns = require('dns');

// Force Google/Cloudflare DNS to resolve MongoDB SRV records (fixes Windows DNS issues)
dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);

const connectDB = async () => {
  try {
    console.log('⏳ Connecting to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      family: 4,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
