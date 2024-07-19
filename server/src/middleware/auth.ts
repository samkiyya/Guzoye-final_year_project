import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import User from "../models/user";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userRole?: string;
    }
  }
}

// Middleware to verify the token
export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(403)
      .json({ success: false, message: "Not authorized. No token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    ) as JwtPayload;

    if (!decoded) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.userId = decoded.userId;
    req.userRole = decoded.userRole;
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ message: "Token verification failed" });
  }
};

// Middleware to verify user roles
export const verifyRole = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized. No userId in request",
      });
    }

    try {
      const user = await User.findById(req.userId);

      if (!user || !allowedRoles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: Access is denied",
        });
      }

      // Add userRole to the request object if needed
      req.userRole = user.role;

      next();
    } catch (error) {
      console.error("Role verification failed:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };
};
