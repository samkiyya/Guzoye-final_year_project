import { Request, Response, NextFunction } from "express";
import User from "../models/user";

const verifyRole = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findById(req.userId);
      if (!user || !allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: "Forbidden: Access is denied" });
      }
      next();
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error", error });
    }
  };
};

export default verifyRole;
