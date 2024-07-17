import mongoose, { Document, Schema } from "mongoose";

export interface TourType extends Document {
  title: string;
  city: string;
  address: string;
  distance: number;
  desc: string;
  maxGroupSize?: number;
  price: number;
  featured: boolean;
  reviews: Schema.Types.ObjectId[];
  photo: string[];
  usrId?: string;
  createdAt?: Date;
  updatedAt?: Date; // 'updatedAt' is more commonly used than 'lastUpdated'
}

const tourSchema = new Schema<TourType>(
  {
    title: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    distance: { type: Number, required: true },
    photo: { type: [String], required: true },
    desc: { type: String, required: true },
    price: { type: Number, required: true },
    maxGroupSize: { type: Number },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    featured: { type: Boolean, required: true },
    usrId: { type: String },
  },
  { timestamps: true }
);

const Tour = mongoose.model<TourType>("Tour", tourSchema);

export default Tour;
