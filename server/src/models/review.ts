import mongoose, { Schema } from "mongoose";

export type ReviewType = {
  productId: mongoose.Types.ObjectId;
  username: string;
  reviewText: string;
  rating: number;
  createdAt?: Date;
  updatedAt?: Date;
};

const reviewSchema = new mongoose.Schema<ReviewType>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Tour",
    },
    username: {
      type: String,
      required: true,
    },
    reviewText: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);
