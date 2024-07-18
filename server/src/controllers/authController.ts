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

  const { username, email } = req.body as UserType;

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

    const newUser = await User.create(req.body);

    //create token
    const token = jwt.sign(
      { userId: newUser._id, userRole: newUser.role },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "1d" }
    );

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24,
    });

    res
      .status(201)
      .json({ message: "User registered successfully", data: token });
  } catch (err) {
    next(err);
    res.status(500).json({ message: "Something went wrong, please try again" });
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

  const { username, email } = req.body;

  try {
    const validUser = await User.findOne({ $or: [{ email }, { username }] });

    if (!validUser) {
      return res.status(404).json({
        success: false,
        message: "Incorrect email or password",
      });
    }

    const isMatch = await bcrypt.compare(req.body.password, validUser.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect email or password" });
    }

    //create token
    const token = jwt.sign(
      { userId: validUser.id, userRole: validUser.role },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "1d" }
    );

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: { email: validUser.email, role: validUser.role, token },
    });
  } catch (error: any) {
    next(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong, please try to login again",
    });
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
        { expiresIn: "1d" }
      );

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24,
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
      { expiresIn: "1d" }
    );

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    next(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong, please try to login again",
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.cookie("auth_token", "", { maxAge: 0 });
    res.status(201).json("Logged out successfully");
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      err: "Server Error",
    });
  }
};
