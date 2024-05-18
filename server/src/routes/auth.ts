import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/auth";
import { login, register } from "../controllers/authController";

const router = express.Router();
router.post(
  "/register",
  [
    check("firstName", "First name is required").isString(),
    check("lastName", "Last name is required").isString(),
    check("username", "User name is required").isString(),
    check("email", "Email is required").isString(),
    check("password", "password 8 or more character is required").isLength({
      min: 8,
    }),
  ],
  register
);
router.post("/login", login);

export default router;
