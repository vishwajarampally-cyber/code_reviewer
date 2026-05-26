const mongoose = require('mongoose');

let cachedConnection = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('MONGODB_URI not set - skipping MongoDB connection');
    return null;
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (cachedConnection) {
    return cachedConnection;
  }

  // Configure mongoose (avoid deprecated options warnings)
  mongoose.set('strictQuery', false);
  mongoose.set('bufferCommands', false);

  cachedConnection = mongoose
    .connect(uri)
    .then(() => {
      console.log('MongoDB connected');
      return mongoose.connection;
    })
    .catch((err) => {
      cachedConnection = null;
      console.error(`MongoDB connection error: ${err.message}`);
      return null;
    });

  return cachedConnection;
};

module.exports = connectDB;
