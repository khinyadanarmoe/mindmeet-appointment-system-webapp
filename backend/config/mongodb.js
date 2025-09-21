import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Connect to MongoDB using the URI with database name specified as an option
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'mindmeet' // Specify the database name here
    });
    
    console.log("MongoDB connected successfully to mindmeet database");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;