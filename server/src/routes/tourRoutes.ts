import express from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import { body } from "express-validator";
import verifyToken from "../middleware/auth";
import verifyRole from "../middleware/verifyRole";
import {
  createTour,
  updateTour,
  deleteTour,
  getTours,
} from "../controllers/tourController";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

// Create Tour - Accessible only by admin
router.post(
  "/",
  verifyToken,
  verifyRole(["admin"]),
  [
    body("title").notEmpty().withMessage("Title is required").isString(),
    body("city").notEmpty().withMessage("City is required").isString(),
    body("address").notEmpty().withMessage("Address is required").isString(),
    body("distance").notEmpty().withMessage("Distance is required").isNumeric(),
    body("desc").notEmpty().withMessage("Description is required").isString(),
    body("price").notEmpty().withMessage("Price is required").isNumeric(),
    body("featured").isBoolean().withMessage("Featured should be boolean"),
    body("reviews").isArray().withMessage("Reviews should be an array"),
    body("createdAt")
      .notEmpty()
      .withMessage("CreatedAt is required")
      .isISO8601(),
    body("updatedAt")
      .notEmpty()
      .withMessage("UpdatedAt is required")
      .isISO8601(),
  ],
  upload.array("imageFiles", 6),
  createTour
);

// Update Tour - Accessible only by admin
router.put("/:id", verifyToken, verifyRole(["admin"]), updateTour);

// Delete Tour - Accessible only by admin
router.delete("/:id", verifyToken, verifyRole(["admin"]), deleteTour);

// Get Tours - Accessible by travelers and admins
router.get("/", verifyToken, verifyRole(["admin", "traveler"]), getTours);

export default router;
