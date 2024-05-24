import express from "express";
import { verifyToken, verifyRole } from "../middleware/auth";
import {
  bookPackage,
  cancelBooking,
  deleteBookingHistory,
  getAllBookings,
  getAllUserBookings,
  getCurrentBookings,
  getUserCurrentBookings,
} from "../controllers/bookingController";

const router = express.Router();

// book package
router.post("/book-package/:packageId", verifyToken, bookPackage);

//get all current bookings manager
router.get(
  "/get-currentBookings",
  verifyToken,
  verifyRole(["manager"]),
  getCurrentBookings
);

//get all bookings admin
router.get(
  "/get-allBookings",
  verifyToken,
  verifyRole(["manager"]),
  getAllBookings
);

//get all current bookings by user id
router.get("/get-UserCurrentBookings/:id", verifyToken, getUserCurrentBookings);

//get all bookings by user id
router.get("/get-allUserBookings/:id", verifyToken, getAllUserBookings);

//delete history of booking
router.delete(
  "/delete-booking-history/:id/:userId",
  verifyToken,
  deleteBookingHistory
);

//cancle booking by id
router.post("/cancel-booking/:id/:userId", verifyToken, cancelBooking);

export default router;
