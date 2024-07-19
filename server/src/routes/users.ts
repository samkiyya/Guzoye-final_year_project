import express, { Request, Response, NextFunction } from "express";
import { verifyToken, verifyRole } from "../middleware/auth";
import {
  deleteUser,
  getAllUser,
  getSingleUser,
  updateUser,
  updateProfilePhoto,
  updateUserPassword,
  deleteUserAccount,
  createSchedule,
  updateSchedule,
  getSchedule,
  deleteSchedule,
  createQuiz,
  getSingleQuiz,
  getQuizzes,
  updateQuiz,
  deleteQuiz,
} from "../controllers/userController";

const router = express.Router();

// User authentication routes
router.get("/user-auth", verifyToken, (req: Request, res: Response) => {
  res.status(200).send({ check: true });
});

router.get(
  "/guide-auth",
  verifyToken,
  verifyRole(["guide"]),
  (req: Request, res: Response) => {
    res.status(200).send({ check: true });
  }
);

router.get(
  "/admin-auth",
  verifyToken,
  verifyRole(["admin"]),
  (req: Request, res: Response) => {
    res.status(200).send({ check: true });
  }
);

router.get(
  "/manager-auth",
  verifyToken,
  verifyRole(["manager"]),
  (req: Request, res: Response) => {
    res.status(200).send({ check: true });
  }
);

// User routes
router.put("/:id", verifyToken, verifyRole(["traveler"]), updateUser);

router.put(
  "/update-profile-photo/:id",
  verifyToken,
  async (req: Request, res: Response) => {
    // Ensure user can only update their own profile photo
    if (req.params.id !== req.userId) {
      return res.status(403).json({
        message: "Forbidden: Cannot update another user's profile photo",
      });
    }
    updateProfilePhoto(req, res);
  }
);

router.put(
  "/update-password/:id",
  verifyToken,
  async (req: Request, res: Response) => {
    // Ensure user can only update their own password
    if (req.params.id !== req.userId) {
      return res
        .status(403)
        .json({ message: "Forbidden: Cannot update another user's password" });
    }
    updateUserPassword(req, res);
  }
);

router.delete(
  "/delete/:id",
  verifyToken,
  verifyRole(["traveler"]),
  async (req: Request, res: Response, next: NextFunction) => {
    // Ensure user can only delete their own account
    if (req.params.id !== req.userId) {
      return res
        .status(403)
        .json({ message: "Forbidden: Cannot delete another user's account" });
    }
    deleteUserAccount(req, res, next);
  }
);

// Admin routes
router.delete(
  "/admin/user/:id",
  verifyToken,
  verifyRole(["admin"]),
  deleteUser
);

// User information routes
router.get("/:id", verifyToken, getSingleUser);

router.get("/", verifyToken, verifyRole(["manager", "admin"]), getAllUser);

// Schedule routes
router.post(
  "/schedule",
  verifyToken,
  verifyRole(["manager", "admin"]),
  createSchedule
);
router.put(
  "/schedule/:id",
  verifyToken,
  verifyRole(["manager", "admin"]),
  updateSchedule
);
router.get("/schedule/:id", verifyToken, getSchedule);
router.delete(
  "/schedule/:id",
  verifyToken,
  verifyRole(["manager", "admin"]),
  deleteSchedule
);

// Quiz routes
router.post("/quiz", verifyToken, verifyRole(["manager", "admin"]), createQuiz);
router.get("/quiz/:id", getSingleQuiz);
router.get("/quiz", getQuizzes);
router.put(
  "/quiz/:id",
  verifyToken,
  verifyRole(["manager", "admin"]),
  updateQuiz
);
router.delete(
  "/quiz/:id",
  verifyToken,
  verifyRole(["manager", "admin"]),
  deleteQuiz
);

export default router;
