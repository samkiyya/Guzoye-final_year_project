import express from "express";
import {
  createReview,
  averageRating,
  getAllRatings,
  ratingGiven,
} from "../controllers/reviewController";
import { verifyToken, verifyRole } from "../middleware/auth";

const router = express.Router();
//create a rating/review
router.post("/:tourId", verifyToken, verifyRole(["traveler"]), createReview);

//get average rating of package
router.get("/average-rating/:id", averageRating);

//check if rating given by user to a package
router.get("/rating-given/:userId/:packageId", verifyToken, ratingGiven);

//get all ratings by package id
router.get("/get-ratings/:tourId/", getAllRatings);
export default router;
