import mongoose, { Schema } from "mongoose";

export type ReviewType = {
  packageId: mongoose.Types.ObjectId;
  username: string;
  reviewText: string;
  rating: number;
  userRef: string;
  userProfileImg: string;
  createdAt?: Date;
  updatedAt?: Date;
};

const reviewSchema = new mongoose.Schema<ReviewType>(
  {
    packageId: {
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
    userRef: {
      type: String,
      required: true,
    },
    userProfileImg: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);
