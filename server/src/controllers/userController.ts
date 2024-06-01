import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import User, { UserType } from "../models/user";

//Create or register a new User
export const createUser = async (req: Request, res: Response) => {
  const newUser = new User(req.body) as UserType;
  if (req.body.password) {
    if (req.body.password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
  }
  if (req.body.username) {
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      return res.status(400).json({
        success: false,
        message: "Username must be between 7 and 20 characters",
      });
    }
    if (req.body.username.includes(" ")) {
      return res.status(400).json({
        success: false,
        message: "Username must not contain space",
      });
    }
    if (req.body.username.match(/^[a-zA-Z0-9]+$/) == null) {
      return res.status(400).json({
        success: false,
        message: "Username must contain only letters and numbers",
      });
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return res.status(400).json({
        success: false,
        message: "Username must be lowercase",
      });
    }
  }
  try {
    const savedUser = await newUser.save();

    res.status(200).json({
      success: true,
      message: "Successfully created",
      data: savedUser,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: true, message: "Failed to create. Try again!" });
  }
};

//Update User details
export const updateUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (id !== req.body._id) {
    return res.status(403).json({
      success: false,
      message: "You are not allowed to update this user",
    });
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      success: true,
      message: "Successfully updated",
      data: updatedUser,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(200).send({
        success: true,
        message: "email already taken please login!",
      });
    } else
      res.status(500).json({ success: false, message: "Failed to update" });
  }
};

//update user profile photo
export const updateProfilePhoto = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    if (req.body.id !== id) {
      return res.status(401).send({
        success: false,
        message:
          "You can only update your own account profile photo please login again!",
      });
    }

    const updatedProfilePhoto = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          userProfileImg: req.body.userProfileImg,
        },
      },
      { new: true }
    );

    const validUser = await User.findById(id);

    if (updatedProfilePhoto) {
      return res.status(201).send({
        success: true,
        message: "Profile photo updated",
        user: validUser,
      });
    } else {
      return res.status(500).send({
        success: false,
        message: "Something went wrong",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// update user password
export const updateUserPassword = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    if (req.body.id !== id) {
      return res.status(401).send({
        success: false,
        message:
          "You can only update your own account password please login again!",
      });
    }

    const validUser = await User.findById(req.params.id);

    if (!validUser) {
      return res.status(404).send({
        success: false,
        message: "User Not Found!",
      });
    }

    const oldPassword = req.body.oldpassword;
    const newPassword = req.body.newpassword;

    const validPassword = bcrypt.compareSync(oldPassword, validUser.password);
    if (!validPassword) {
      return res.status(200).send({
        success: false,
        message: "Invalid password",
      });
    }

    const updatedHashedPassword = bcrypt.hashSync(newPassword, 10);
    const updatedPassword = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          password: updatedHashedPassword,
        },
      },
      { new: true }
    );

    return res.status(201).send({
      success: true,
      message: "Password Updated Successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

//delete user
export const deleteUserAccount = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (req.body.id !== id)
    return res.status(401).send({
      success: false,
      message: "You can only delete your account!",
    });
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("verify_token"); //clear cookie before sending json
    res.status(200).send({
      success: true,
      message: "User account has been deleted!",
    });
  } catch (error) {
    console.log(error);
  }
};
//Delete User by Admin
export const deleteUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (req.body.role !== "admin" && id !== req.body._id) {
    return res.status(403).json({
      success: false,
      message: "You are not allowed to delete this user",
    });
  }

  try {
    await User.findByIdAndDelete(id);

    res
      .status(200)
      .json({ success: true, message: "user has been Successfully deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to delete the user" });
  }
};

//Get single User
export const getSingleUser = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id);

    res
      .status(200)
      .json({ success: true, message: "Successfully", data: user });
  } catch (error) {
    res.status(404).json({ success: false, message: "Not Found" });
  }
};

//GetAll User
export const getAllUser = async (req: Request, res: Response) => {
  if (req.body.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "You are not allowed to view all users",
    });
  }
  try {
    const startIndex = parseInt(req.query.startIndex as string) || 0;
    const limit = parseInt(req.query.limit as string) || 10;
    const sortDirection = (req.query.sortDirection as string) || "asc" ? 1 : -1;

    const users = await User.find({})
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    const usersWithOutPassword = users.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    const totalUsers = await User.countDocuments({});
    const currentTime = new Date();
    const oneMonthAgo = new Date(
      currentTime.getFullYear(),
      currentTime.getMonth() - 1,
      currentTime.getDate()
    );
    const totalUsersOneMonthAgo = await User.countDocuments({
      createdAt: { $lt: oneMonthAgo },
    });
    res.status(200).json({
      success: true,
      message: "Successfully",
      data: users,
      totalUsers,
      totalUsersOneMonthAgo,
      usersWithOutPassword,
    });
  } catch (error) {
    res.status(404).json({ success: false, message: "Not Found" });
  }
};

//delete user admin
export const deleteUserAccountAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await User.findByIdAndDelete(req?.params?.id);
    res.status(200).send({
      success: true,
      message: "User account has been deleted!",
    });
  } catch (error) {
    console.log(error);
  }
};
