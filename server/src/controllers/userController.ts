import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import { Model } from "mongoose";
import User, { UserType } from "../models/user";
import guideSchedule, { GuideScheduleType } from "../models/guideSchedule";
import userSchedule, { UserScheduleType } from "../models/userSchedule";
import Quiz from "../models/quizModel";

// get User
export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await User.findById(req.params.id);
    res.json(result);
  } catch (error: any) {
    next(error);
  }
};
// Update User details
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const id = req.params.id;
  if (id !== req.body._id) {
    return res.status(403).json({
      success: false,
      message: "You are not allowed to update this user",
    });
  }

  // Hash password if provided
  if (req.body.password) {
    if (req.body.password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }
  }
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  // Check for existing email
  if (req.body.email) {
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }
  }

  // Check for existing username
  if (req.body.username) {
    const usernameExists = await User.findOne({ username: req.body.username });
    if (usernameExists) {
      return res.status(400).json({
        success: false,
        message: "Username already exists",
      });
    }

    // Validate username constraints
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      return res.status(400).json({
        success: false,
        message: "Username must be between 7 and 20 characters",
      });
    }

    if (req.body.username.includes(" ")) {
      return res.status(400).json({
        success: false,
        message: "Username must not contain spaces",
      });
    }

    if (!/^[a-zA-Z0-9]+$/.test(req.body.username)) {
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
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUserDetails = {
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      userProfileImg: req.body.userProfileImg,
      ...(user.role === "guide" && {
        skill: req.body.skill,
        availability: req.body.availability,
      }),
    };

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updatedUserDetails },
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
        message: "Email already taken, please login!",
      });
    } else {
      res.status(500).json({ success: false, message: "Failed to update" });
    }
    next(error);
  }
};

// Update user profile photo
export const updateProfilePhoto = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    if (req.body.id !== id) {
      return res.status(401).send({
        success: false,
        message:
          "You can only update your own account profile photo. Please login again!",
      });
    }

    const updatedProfilePhoto = await User.findByIdAndUpdate(
      id,
      { $set: { userProfileImg: req.body.userProfileImg } },
      { new: true }
    );

    if (updatedProfilePhoto) {
      return res.status(201).send({
        success: true,
        message: "Profile photo updated",
        user: updatedProfilePhoto,
      });
    } else {
      return res.status(500).send({
        success: false,
        message: "Something went wrong",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "An error occurred while updating profile photo",
    });
  }
};

// Update user password
export const updateUserPassword = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    if (req.body.id !== id) {
      return res.status(401).send({
        success: false,
        message:
          "You can only update your own account password. Please login again!",
      });
    }

    const validUser = await User.findById(id);
    if (!validUser) {
      return res.status(404).send({
        success: false,
        message: "User Not Found!",
      });
    }

    const { oldpassword, newpassword } = req.body;
    const validPassword = bcrypt.compare(oldpassword, validUser.password);
    if (!validPassword) {
      return res.status(200).send({
        success: false,
        message: "Invalid password",
      });
    }

    const updatedHashedPassword = bcrypt.hash(newpassword, 10);
    await User.findByIdAndUpdate(
      id,
      { $set: { password: updatedHashedPassword } },
      { new: true }
    );

    return res.status(201).send({
      success: true,
      message: "Password Updated Successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "An error occurred while updating the password",
    });
  }
};

// Delete user account
export const deleteUserAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  if (req.body.id !== id) {
    return res.status(401).send({
      success: false,
      message: "You can only delete your account!",
    });
  }

  try {
    const result = await User.findByIdAndDelete(id);
    res.clearCookie("verify_token");
    res.status(200).json({
      success: true,
      message: "User account has been deleted!",
      result,
    });
  } catch (error: any) {
    next(error);
    res.status(500).send({
      success: false,
      message: "An error occurred while deleting the account",
    });
  }
};

// Delete user by Admin
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  if (req.body.role !== "admin" && id !== req.body._id) {
    return res.status(403).json({
      success: false,
      message: "You are not allowed to delete this user",
    });
  }

  try {
    await User.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "User has been successfully deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete the user",
    });
    next(error);
  }
};

// Create schedule
export const createSchedule = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const isGuide = req.body.role === "guide";
  const { scheduleName, userName, email, destination, date, tourists } =
    req.body as GuideScheduleType & UserScheduleType;

  if (
    !scheduleName ||
    !userName ||
    !email ||
    !destination ||
    !date ||
    (isGuide && tourists == null)
  ) {
    return res.status(400).json({
      success: false,
      message: "Please fill all the fields",
    });
  }

  const newSchedule = new (isGuide ? guideSchedule : userSchedule)({
    scheduleName,
    userName,
    email,
    destination,
    date,
    ...(isGuide && { tourists }),
  });

  try {
    await newSchedule.save();
    res.status(201).json({
      success: true,
      message: "Schedule Successfully created",
      data: newSchedule,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to create schedule" });
    next(error);
  }
};
// Get schedules
export const getSchedule = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  try {
    const schedules = await (
      (user.role === "guide" ? guideSchedule : userSchedule) as Model<
        GuideScheduleType | UserScheduleType
      >
    ).find({ email: user.email });
    if (!schedules) {
      return res.status(404).json({
        success: false,
        message: "No schedule found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Schedule retrieved successfully",
      data: schedules,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to retrieve schedules" });
  }
};

export const deleteSchedule = async (req: Request, res: Response) => {
  try {
    let user = await userSchedule.findByIdAndDelete(req.params.id);
    res.status(200).send({
      success: true,
      message: "Schedule has been deleted!",
    });
    if (!user) {
      user = await guideSchedule.findByIdAndDelete(req.params.id);
      res.status(200).send({
        success: true,
        message: "Schedule has been deleted!",
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Schedule Not Found" });
    }
    console.log(user);
  } catch (error) {
    console.log(error);
  }
};
export const updateSchedule = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (req.body.role === "guide") {
    const { scheduleName, userName, email, tourists, destination, date } =
      req.body as GuideScheduleType;
    if (
      !scheduleName ||
      !userName ||
      !email ||
      !tourists ||
      !destination ||
      !date ||
      scheduleName === "" ||
      userName === "" ||
      email === "" ||
      tourists === null ||
      destination === null ||
      date === null
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all the fields" });
    }
    const updatedSchedule = await guideSchedule.findByIdAndUpdate(
      id,
      {
        $set: {
          scheduleName,
          userName,
          email,
          tourists,
          destination,
          date,
        },
      },
      { new: true }
    );
    if (!updatedSchedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }
    res.status(200).json({
      success: true,
      message: "Successfully updated",
      data: updatedSchedule,
    });
  } else {
    const { scheduleName, userName, email, destination, date } =
      req.body as UserScheduleType;
    if (
      !scheduleName ||
      !userName ||
      !email ||
      !destination ||
      !date ||
      scheduleName === "" ||
      userName === "" ||
      email === "" ||
      destination === null ||
      date === null
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all the fields" });
    }
    const updatedSchedule = await userSchedule.findByIdAndUpdate(
      id,
      {
        $set: {
          scheduleName,
          userName,
          email,
          destination,
          date,
        },
      },
      { new: true }
    );
    if (!updatedSchedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }
    res.status(200).json({
      success: true,
      message: "Successfully updated",
      data: updatedSchedule,
    });
  }
};

// Create quiz
export const createQuiz = async (req: Request, res: Response) => {
  const { title, questions } = req.body;

  if (!title || !questions || questions.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "Please fill all the fields" });
  }

  const newQuiz = new Quiz({ title, questions });

  try {
    await newQuiz.save();
    res.status(201).json({
      success: true,
      message: "Quiz Successfully created",
      data: newQuiz,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create quiz" });
  }
};

// Get quizzes
export const getQuizzes = async (req: Request, res: Response) => {
  try {
    const quizzes = await Quiz.find();
    res.status(200).json({
      success: true,
      message: "Quizzes retrieved successfully",
      data: quizzes,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to retrieve quizzes" });
  }
};

// Update quiz
export const updateQuiz = async (req: Request, res: Response) => {
  const quizId = req.params.quizId;

  try {
    const updatedQuiz = await Quiz.findByIdAndUpdate(quizId, req.body, {
      new: true,
    });

    if (!updatedQuiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Quiz updated successfully",
      data: updatedQuiz,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update quiz" });
  }
};

// Delete quiz
export const deleteQuiz = async (req: Request, res: Response) => {
  const quizId = req.params.quizId;

  try {
    const deletedQuiz = await Quiz.findByIdAndDelete(quizId);

    if (!deletedQuiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Quiz deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete quiz" });
  }
};

// Get single quiz
export const getSingleQuiz = async (req: Request, res: Response) => {
  const quizId = req.params.quizId;

  try {
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Quiz retrieved successfully",
      data: quiz,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to retrieve quiz" });
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
