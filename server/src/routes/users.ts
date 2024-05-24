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
} from "../controllers/userController";
const router = express.Router();
//user auth
router.get("/user-auth", verifyToken, (req, res) => {
  return res.status(200).send({ check: true });
});

//travel guide auth
router.get("/guide-auth", verifyToken, verifyRole(["guide"]), (req, res) => {
  res.status(200).send({ check: true });
});

//admin auth
router.get("/admin-auth", verifyToken, verifyRole(["admin"]), (req, res) => {
  res.status(200).send({ check: true });
});

//manager auth
router.get(
  "/manager-auth",
  verifyToken,
  verifyRole(["manager"]),
  (req, res) => {
    res.status(200).send({ check: true });
  }
);

// Update user profile - Accessible only by specific user
router.put("/update/:id", verifyToken, updateUser);

//update user profile photo
router.post("/update-profile-photo/:id", verifyToken, updateProfilePhoto);

//update user password
router.post("/update-password/:id", verifyToken, updateUserPassword);

//delete user account
router.delete("/delete/:id", verifyToken, deleteUserAccount);

//admin delete user accounts
router.delete("/:id", verifyToken, verifyRole(["admin"]), deleteUser);

//get single user - Accessible by all users but only thiers
router.get("/:id", verifyToken, getSingleUser);

// Get all user - Accessible by travelers and manager
router.get("/", verifyToken, verifyRole(["manager", "admin"]), getAllUser);
export default router;
