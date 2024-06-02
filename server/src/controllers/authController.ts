import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import User, { UserType } from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstName, lastName, username, email, isEthiopian, role, password } =
    req.body as UserType;

  if (!username || !email || !password || !firstName || !lastName) {
    return res
      .status(400)
      .json({ success: false, message: "Please fill all the required fields" });
  }

  try {
    if (username.length < 7 || username.length > 20) {
      return res.status(400).json({
        success: false,
        message: "Username must be between 7 and 20 characters",
      });
    }
    if (username.includes(" ")) {
      return res.status(400).json({
        success: false,
        message: "Username must not contain space",
      });
    }
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      return res.status(400).json({
        success: false,
        message: "Username must contain only letters and numbers",
      });
    }
    if (username !== username.toLowerCase()) {
      return res.status(400).json({
        success: false,
        message: "Username must be lowercase",
      });
    }

    let userExistence = await User.findOne({ $or: [{ email }, { username }] });
    if (userExistence) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      isEthiopian,
      role,
    });

    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "1h" }
    );

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60,
    });

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong, please try again" });
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Please fill all the required fields" });
  }

  try {
    const validUser = await User.findOne({ $or: [{ email }, { username }] });

    if (!validUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, validUser.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect email or password" });
    }

    const token = jwt.sign(
      { userId: validUser.id, userRole: validUser.role },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "1h" }
    );

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60,
    });

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: { email, role: validUser.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong, please try to login again",
    });
    next(err);
  }
};

export const googleAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, name, userProfileImg } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      const token = jwt.sign(
        { userId: user.id, userRole: user.role },
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: "1h" }
      );

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60,
      });

      return res.status(200).json({
        success: true,
        message: "Logged in successfully",
        data: { email, role: user.role },
      });
    }

    const generatedPassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);
    const username =
      name.toLowerCase().replace(/\s+/g, "") +
      Math.random().toString(10).slice(-4);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      userProfileImg,
    });

    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id, userRole: newUser.role },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "1h" }
    );

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60,
    });

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong, please try to login again",
    });
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.clearCookie("auth_token").status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong, please try to logout again",
    });
    next(err);
  }
};
