import mongoose, { Schema } from "mongoose";

export type BookingType = {
  user: Schema.Types.ObjectId;
  BookingTravels: [
    {
      name: string;
      qty: number;
      image: string;
      price: number;
      travel: Schema.Types.ObjectId;
    }
  ];
  travelerAddress: {
    address: string;
    phone: number;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  paidAt: Date;
  paymentResult: {
    id: string;
    status: string;
    update_time: string;
    email_address: string;
  };
  travelsPrice: number;
  taxPrice: number;
  isPaid: boolean;
  totalPrice: number;
  guestSize: number;
  bookAt: Date;
};

const bookingSchema = new mongoose.Schema<BookingType>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    BookingTravels: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        travel: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "travel",
        },
      },
    ],

    travelerAddress: {
      address: { type: String, required: true },
      phone: {
        type: Number,
        required: true,
      },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    travelsPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },

    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },

    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },

    paidAt: {
      type: Date,
    },
    guestSize: {
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
