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

  try {
    const {
      username,
      email,
      password,
      firstName,
      lastName,
      photo,
      isEthiopian,
    } = req.body;

    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      photo,
      isEthiopian,
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
  const username = req.body.username;
  try {
    const user = await User.findOne({ $or: [{ email }, { username }] });
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
    res.status(500).send({
      success: false,
      message: "Something went wrong, please try to login again",
    });
  }
};

export const googleAuth = async (req: Request, res: Response) => {
  const { email, name, photo } = req.body;
  try {
    let user = await User.findOne({ email });
    // if user already exist
    if (user) {
      const token = jwt.sign(
        { userId: user.id, userRole: user.role },
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
      res.status(200).send({
        success: true,
        message: " logged in successfully",
        data: { email: email, role: user.role },
      });
    } else {
      // if user doesn't exist create a new user with a random password and user name then send the response to client
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(generatedPassword, salt);
      const username =
        name.toLowerCase().split(" ").join("") +
        Math.random().toString(10).slice(-4);

      const newUser = new User({
        username: username,
        email: email,
        password: hashedPassword,
        photo: photo,
      });
      try {
        await newUser.save();
      } catch (error) {
        return res.status(500).send({ message: "User creation failed" });
      }
      // create jwt token
      const token = jwt.sign(
        { userId: newUser._id, userRole: newUser.role },
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
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Something went wrong, please try to login again",
    });
  }
};

// user log out
export const logout = async (req: Request, res: Response) => {
  try {
    res.cookie("auth_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 0, // set to 0 to expires imediately
    });
    res.status(200).send({
      success: true,
      message: "logged out successfully",
    });
    // Redirect the user to the login page or home page
    res.redirect("/login");
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Something went wrong, please try to logout again",
    });
    res.end();
  }
};
