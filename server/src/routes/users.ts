import express from "express";
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
router.get("/user-auth", verifyToken, (req, res) => {
  res.status(200).send({ check: true });
});

router.get("/guide-auth", verifyToken, verifyRole(["guide"]), (req, res) => {
  res.status(200).send({ check: true });
});

router.get("/admin-auth", verifyToken, verifyRole(["admin"]), (req, res) => {
  res.status(200).send({ check: true });
});

router.get(
  "/manager-auth",
  verifyToken,
  verifyRole(["manager"]),
  (req, res) => {
    res.status(200).send({ check: true });
  }
);

// User routes
router.put("/:id", verifyToken, verifyRole(["traveler"]), updateUser);

router.post(
  "/update-profile-photo/:id",
  verifyToken,
  verifyRole(["traveler"]),
  updateProfilePhoto
);

router.post(
  "/update-password/:id",
  verifyToken,
  verifyRole(["traveler"]),
  updateUserPassword
);

router.delete(
  "/delete/:id",
  verifyToken,
  verifyRole(["traveler"]),
  deleteUserAccount
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
router.post("/schedule", createSchedule);
router.put("/schedule/:id", verifyToken, updateSchedule);
router.get("/schedule/:id", getSchedule);
router.delete("/schedule/:id", deleteSchedule);

// Quiz routes
router.post("/quiz", createQuiz);
router.get("/quiz/:id", getSingleQuiz);
router.get("/quiz", getQuizzes);
router.put("/quiz/:id", updateQuiz);
router.delete("/quiz/:id", deleteQuiz);

export default router;
