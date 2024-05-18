import mongoose, { Schema } from "mongoose";

export type BookingType = {
  userId: mongoose.Types.ObjectId;
  userEmail: string;
  tourName: string;
  fullName: string;
  guestSize: number;
  phone: number;
  bookAt: Date;
};
const bookingSchema = new mongoose.Schema<BookingType>(
  {
    userId: {
      type: Schema.Types.ObjectId,
    },
    userEmail: {
      type: String,
    },
    tourName: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
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
    bookAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
