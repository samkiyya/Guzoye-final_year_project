import mongoose from "mongoose";
import { ReviewType } from "./review";

export type TourType = {
  _id: mongoose.Types.ObjectId;
  userId: string;
  title: string;
  city: string;
  distance: number;
  photo: string[];
  desc: string;
  price: number;
  reviews: ReviewType;
  featured: boolean;
  lastUpdated: Date; //  added because of timestamps: true in schema
};
const tourSchema = new mongoose.Schema<TourType>(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    city: {
      type: String,
      required: true,
    },
    distance: {
      type: Number,
      required: true,
    },
    photo: [
      {
        type: String,
        required: true,
      },
    ],
    desc: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },

    reviews: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Review",
      },
    ],

    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model<TourType>("Tour", tourSchema);
