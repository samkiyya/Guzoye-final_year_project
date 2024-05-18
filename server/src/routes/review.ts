import express from "express";
import { createReview } from "../controllers/reviewController";
import verifyToken from "../middleware/auth";
import verifyRole from "../middleware/verifyRole";

const router = express.Router();

router.post(
  "/:tourId",
  verifyToken,
  verifyRole(["manager", "traveler"]),
  createReview
);
export default router;
