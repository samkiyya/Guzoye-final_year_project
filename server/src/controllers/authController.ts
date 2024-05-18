import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/auth";
import { UserType } from "../models/user";

//user registration
export const register = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    let user = await User.findOne({
      email: req.body.email,
    });
    if (user) {
      return res.status(400).send({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      photo: req.body.photo,
    });
    await newUser.save();
    const token = jwt.sign(
      { userId: newUser.id },
      process.env.JWT_SECRET_KEY as string,
      {
        expiresIn: "1h",
      }
    );
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60,
    });
    res.status(201).send({ message: "User created successfully" });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ message: "Something went wrong, please register try again" });
  }
};

//user login
export const login = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await User.findOne({ email });
    // if user doesn't exist return custome message
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found or Invalid Credentials",
      });
    }
    // if user exist check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    // if password is not correct return custome message
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect Email or password" });
    }
    //creating a jwt token
    const token = jwt.sign(
      { userId: user.id, userRole: user.role },
      process.env.JWT_SECRET_KEY as string,
      {
        expiresIn: "1h",
      }
    );
    // set token in the browsers cookie and send the response to client
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60,
    });

    res.status(200).send({
      success: true,
      message: " logged in successfully",
      data: { email: email, password: password, role: user.role },
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({
        success: false,
        message: "Something went wrong, please try to login again",
      });
  }
};

// user log out
export const logout = async (req: Request, res: Response) => {
  try {
  } catch (err) {}
};
