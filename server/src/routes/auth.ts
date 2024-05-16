import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/auth";

const router = express.Router();
router.post(
  "/login",
  [
    check("email", "Email is required").isString(),
    check("password", "password 8 or more characters is required").isLength({
      min: 8,
    }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ message: "User not found or Invalid Credentials" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "User not found or Invalid Credentials" });
      }
      //creating a jsonwebtoken
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET_KEY as string,
        {
          expiresIn: "1h",
          // algorithm: "HS256",
          // subject: user.id,
          // issuer: "http://localhost:5000",
          // audience: "http://localhost:3000",
          // jwtid: user.id,
        }
      );
      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60,
      });
      res.status(200).json({
        UserId: user._id,
        // message: "User logged in successfully",role:user.role
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

router.get("/validate-token", verifyToken, (req: Request, res: Response) => {
  res.status(200).send({ userId: req.userId });
});
router.post("/logout", (req: Request, res: Response) => {
  res.cookie("auth_token", "", {
    expires: new Date(0),
  });
  res.send();
});
export default router;
