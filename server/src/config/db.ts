import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);
    console.log("Cloud MongoDB database connected successfully");
  } catch (error) {
    console.log("Failed to connect with cloud MongoDB database");
    try {
      await mongoose.connect(
        process.env.LOCAL_MONGODB_CONNECTION_STRING as string
      );
      console.log("Local MongoDB database connected successfully");
    } catch (error: any) {
      console.error(`ERROR: ${error.message}`);
      process.exit(1);
    }
  }
};

export default connectDB;
