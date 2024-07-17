import express from "express";
import { verifyToken, verifyRole } from "../middleware/auth";
import {
  bookPackage,
  countTotalOrders,
  calculateTotalSales,
  calculateTotalSalesByDate,
  getUserCurrentBookings,
  getAllBookings,
  getAllUserBookings,
  markOrderAsPaid,
  deleteBookingHistory,
  cancelBooking,
} from "../controllers/bookingController";

const router = express.Router();

// book package
router
  .route("/")
  .post(verifyToken, bookPackage)
  .get(verifyToken, verifyRole(["manager"]), getAllBookings);

//get all current bookings by user id
router.route("/:id").get(verifyToken, getUserCurrentBookings);

//get all bookings history by user id
router.route("/mine").get(verifyToken, getAllUserBookings);

router.route("/total-orders").get(countTotalOrders);
router.route("/total-sales").get(calculateTotalSales);
router.route("/total-sales-by-date").get(calculateTotalSalesByDate);
router.route("/:id/pay").put(verifyToken, markOrderAsPaid);
//delete history of booking
router
  .route("/delete-booking/:id/:userId")
  .delete(verifyToken, deleteBookingHistory);

//cancle booking by id
router.route("/cancel-booking/:id/:userId").post(verifyToken, cancelBooking);

export default router;
