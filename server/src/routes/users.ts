import express, { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import verifyToken from "../middleware/auth";
import verifyRole from "../middleware/verifyRole";
import {
  deleteUser,
  getAllUser,
  getSingleUser,
  updateUser,
} from "../controllers/userController";
const router = express.Router();

// Update Tour - Accessible only by manager
router.put("/:id", verifyToken, verifyRole(["traveler"]), updateUser);

// Delete Tour - Accessible only by manager
router.delete("/:id", verifyToken, verifyRole(["manager"]), deleteUser);

//get single tour - Accessible by travelers and manager
router.get(
  "/:id",
  verifyToken,
  verifyRole(["manager", "traveler"]),
  getSingleUser
);

// Get all Tours - Accessible by travelers and manager
router.get("/", verifyToken, verifyRole(["manager", "traveler"]), getAllUser);
export default router;
