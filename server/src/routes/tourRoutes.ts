import express from "express";
import multer from "multer";
import { body } from "express-validator";
import { verifyToken, verifyRole } from "../middleware/auth";
import {
  createTour,
  updateTour,
  deleteTour,
  getTours,
  getSingleTour,
  getTourBySearch,
  getFeaturedTour,
  getTourCount,
} from "../controllers/tourController";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

// Create Tour - Accessible only by manager
router.post(
  "/",
  verifyToken,
  verifyRole(["manager"]),
  [
    body("title").notEmpty().withMessage("Title is required").isString(),
    body("city").notEmpty().withMessage("City is required").isString(),
    body("address").notEmpty().withMessage("Address is required").isString(),
    body("distance").notEmpty().withMessage("Distance is required").isNumeric(),
    body("desc").notEmpty().withMessage("Description is required").isString(),
    body("maxGroupSize")
      .notEmpty()
      .withMessage("group size is required")
      .isNumeric(),
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

// Get tours by search
router.get("/search/getTourBySearch", getTourBySearch);

// Get featured tours
router.get("/search/getFeaturedTours", getFeaturedTour);

// Get tour count - Accessible by manager and Admin
router.get("/search/getTourCount", getTourCount);

// Get all Tours - Accessible by travelers and manager
router.get("/", getTours);

// Get single tour - Accessible by travelers and manager
router.get("/:id", getSingleTour);

// Update Tour - Accessible only by manager
router.put("/:id", verifyToken, verifyRole(["manager"]), updateTour);

// Delete Tour - Accessible only by manager
router.delete("/:id", verifyToken, verifyRole(["manager"]), deleteTour);

export default router;
