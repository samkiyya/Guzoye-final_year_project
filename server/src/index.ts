import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import tourRoutes from "./routes/tourRoutes";
import packageRoutes from "./routes/package";
import reviewRoutes from "./routes/review";
import bookingRoutes from "./routes/booking";
import chapaRoutes from "./routes/chapaRoutes";

import cookieParser from "cookie-parser";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
dotenv.config({});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
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

//middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

// serve static files during deployment
app.use(express.static(path.join(__dirname, "../../client/dist")));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tours", tourRoutes);
app.use("/api/package", packageRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/chapa", chapaRoutes);

app.listen(port, () => {
  connect();
  console.log(`Server is running on port ${port}`);
});
// error handler middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
