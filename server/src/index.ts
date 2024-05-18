import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import tourRoutes from "./routes/tourRoutes";
import reviewRoutes from "./routes/review";
import bookingRoutes from "./routes/booking";
import cookieParser from "cookie-parser";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const port = process.env.PORT || 7000;

//database connection
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);
    console.log("Cloud MongoDB database connected successfully");
  } catch (error) {
    console.log("Failed to connected with cloud MongoDB database");
    try {
      await mongoose.connect(
        process.env.LOCAL_MONGODB_CONNECTION_STRING as string,
        {
          // useNewUrlParser: true,
          // useUnifiedTopology: true,
        }
      );
      console.log("Local MongoDB database connected successfully");
    } catch (error) {
      console.log("Failed to connected with MongoDB database");
    }
  }
};

//midlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

// the following line is to serve our static file during deployment means on production mode, we don't need to run the front end
app.use(express.static(path.join(__dirname, "../../client/dist")));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tours", tourRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/booking", bookingRoutes);

app.listen(port, () => {
  connect();
  console.log(`Server is running on port ${port}`);
});
