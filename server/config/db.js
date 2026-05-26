const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('MONGODB_URI not set - skipping MongoDB connection');
    return;
  }

  // Configure mongoose (avoid deprecated options warnings)
  mongoose.set('strictQuery', false);
  mongoose.set('bufferCommands', false);

  const connectWithRetry = async (retries = 0) => {
    try {
      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log('MongoDB connected');
    } catch (err) {
      console.error(`MongoDB connection error: ${err.message}`);
      // Do not exit the process; schedule a retry so server stays up for local testing
      const delay = Math.min(30000, 2000 * Math.pow(2, retries)); // exponential backoff up to 30s
      console.log(`Retrying MongoDB connection in ${delay / 1000}s...`);
      setTimeout(() => connectWithRetry(retries + 1), delay);
    }
  };

  connectWithRetry();
};

module.exports = connectDB;
