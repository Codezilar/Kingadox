import mongoose from 'mongoose';

export const connectToDB = async () => {
  mongoose.set('strictQuery', true);

  // Check if already connected
  if (mongoose.connection.readyState === 1) {
    console.log('MongoDB is already connected');
    return;
  }

  // Check if connecting
  if (mongoose.connection.readyState === 2) {
    console.log('MongoDB is connecting');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "blog",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connected');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw new Error('Failed to connect to MongoDB');
  }
};