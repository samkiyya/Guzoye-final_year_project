import mongoose, { Schema } from "mongoose";

export type BookingType = {
  packageDetails: mongoose.Types.ObjectId;
  buyer: mongoose.Types.ObjectId;
  userEmail: string;
  tourName: string;
  fullName: string;
  totalPrice: number;
  guestSize: number;
  phone: number;
  date: string;
  status: string;
  bookAt: Date;
};
const bookingSchema = new mongoose.Schema<BookingType>(
  {
    packageDetails: {
      type: Schema.Types.ObjectId,
      ref: "Package",
      required: true,
    },
    tourName: {
      type: String,
      required: true,
    },
    buyer: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    userEmail: {
      type: String,
    },
    fullName: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    guestSize: {
      type: Number,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Booked",
    },
    bookAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
