import { ReviewType } from "./review";
import mongoose, { Document, Schema } from "mongoose";

export interface TourType extends Document {
  title: string;
  city: string;
  address: string;
  distance: number;
  desc: string;
  price: number;
  featured: boolean;
  reviews: string[];
  photo: string[];
  createdAt?: Date;
  lastUpdated?: Date;
  usrId?: string;
}

const tourSchema = new Schema<TourType>(
  {
    title: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    distance: { type: Number, required: true },
    desc: { type: String, required: true },
    price: { type: Number, required: true },
    featured: { type: Boolean, required: true },
    reviews: { type: [String], required: true },
    photo: { type: [String], required: true },
    lastUpdated: { type: Date, default: Date.now },
    usrId: { type: String },
  },
  { timestamps: true }
);

const Tour = mongoose.model<TourType>("Tour", tourSchema);

export default Tour;
