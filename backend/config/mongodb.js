import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Extract the base URI without query parameters
    const baseUri = process.env.MONGODB_URI.split('?')[0];
    // Add the database name before the query parameters
    const dbUri = baseUri + '/mindmeet?' + process.env.MONGODB_URI.split('?')[1];
    
    await mongoose.connect(dbUri);
    console.log("MongoDB connected successfully to mindmeet database");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;