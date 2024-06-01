import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import User from "../models/user";

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies["auth_token"];
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authorization denied, You are not authorized!",
    });
  }
  // if token is exist then verify the token
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    ) as JwtPayload;
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res
      .status(401)
      .json({ message: "sorry failed to verify it is you" });
  }
};

export const verifyRole = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findById(req.userId);
      if (!user || !allowedRoles?.includes(user.role)) {
        return res.status(403).json({ message: "Forbidden: Access is denied" });
      }
      next();
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error", error });
    }
  };
};
