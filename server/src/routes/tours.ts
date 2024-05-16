import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import tour, { TourType } from "../models/tour";
import { body, validationResult } from "express-validator";
import verifyToken from "../middleware/auth";

const router = express.Router();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

// api/tours
router.post(
  "/",
  verifyToken,
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
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const imageFiles = req.files as Express.Multer.File[];
      const newTour: TourType = req.body;

      // Upload the images to Cloudinary
      const uploadPromises = imageFiles.map(async (image) => {
        const b64 = Buffer.from(image.buffer).toString("base64");
        let dataURI = "data:" + image.mimetype + ";base64," + b64;
        try {
          const result = await cloudinary.v2.uploader.upload(dataURI);
          return result.url;
        } catch (err) {
          console.error("Cloudinary upload error:", err);
          throw new Error("Image upload failed");
        }
      });

      const imageUrls = await Promise.all(uploadPromises);

      newTour.photo = imageUrls;
      newTour.lastUpdated = new Date();
      newTour.userId = req.userId; // Assuming verifyToken middleware sets req.userId

      // Save the new tour to the database
      const Tour = new tour(newTour);
      await Tour.save();

      res
        .status(201)
        .send({ success: true, message: "Successfully created", data: Tour });
    } catch (e) {
      console.error("Error creating Tour: ", e);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

export default router;
