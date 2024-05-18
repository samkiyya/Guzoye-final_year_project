import express from "express";
import verifyToken from "../middleware/auth";
import verifyRole from "../middleware/verifyRole";
import {
  createBooking,
  getAllBooking,
  getBooking,
} from "../controllers/bookingController";

const router = express.Router();

router.post("/", verifyToken, verifyRole(["traveler"]), createBooking);
router.get("/:id", verifyToken, verifyRole(["traveler"]), getBooking);
router.get("/", verifyToken, verifyRole(["manager"]), getAllBooking);

export default router;
