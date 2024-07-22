import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import tourRoutes from "./routes/tourRoutes";
import packageRoutes from "./routes/package";
import reviewRoutes from "./routes/review";
import bookingRoutes from "./routes/booking";
import chapaRoutes from "./routes/chapaRoutes";
import connectDB from "./config/db";
import path from "path";

import morgan from "morgan";
import { v2 as cloudinary } from "cloudinary";
dotenv.config({});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const app = express();
const port = process.env.PORT || 8000;
const corsOptions = {
  origin: process.env.FRONTEND_URL || "https://guzoye.onrender.com", //
  credentials: false, // false means no cookies
};
// Database connection
connectDB();
// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(morgan("dev")); //logger
app.use(cookieParser());

// Serve static files during deployment
app.use(express.static(path.join(__dirname, "../../client/dist")));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tours", tourRoutes);
app.use("/api/package", packageRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/payment", chapaRoutes);

// app.get("/paypal", (req:Request, res:Response) => {
//   res.send({ clientId: process.env.CHAPA_API_KEY });
// });
// Serve React app for any other route
app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../client/index.html"));
});

// Error handler middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err); // Log the error
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    status: statusCode,
    error: message,
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
