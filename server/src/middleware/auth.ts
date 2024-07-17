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

    // Add the userId and userRole to the request object
    req.userId = decoded.userId;
    req.userRole = decoded.userRole;
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ message: "Token verification failed" });
  }
};
export const verifyRole = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(403).json({ message: "Not authorized. No token" });
    }

    try {
      const user = await User.findById(req.userId);

      if (!user || !allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: "Forbidden: Access is denied" });
      }

      next();
    } catch (error) {
      console.error("Role verification failed:", error);
      res.status(500).json({ message: "Internal Server Error", error });
    }
  };
};
