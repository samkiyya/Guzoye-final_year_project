import mongoose from "mongoose";

export type PackageType = {
  userId: mongoose.Types.ObjectId;
  packageName: string;
  packageDescription: string;
  packageDestination: string;
  packageDays: number;
  packageNights: number;
  packageAccommodation: string;
  packageTransportation: string;
  packageMeals: string;
  packageActivities: string;
  packagePrice: number;
  packageDiscountPrice: number;
  packageOffer: boolean;
  packageRating: number;
  packageTotalRatings: number;
  packageImages: string[];
  bookAt: Date;
  createdAt?: Date; // Optional, added because of timestamps: true in schema
  updatedAt?: Date;
};
const packageSchema = new mongoose.Schema<PackageType>(
  {
    packageName: {
      type: String,
      required: true,
    },
    packageDescription: {
      type: String,
      required: true,
    },
    packageDestination: {
      type: String,
      required: true,
    },
    packageDays: {
      type: Number,
      required: true,
    },
    packageNights: {
      type: Number,
      required: true,
    },
    packageAccommodation: {
      type: String,
      required: true,
    },
    packageTransportation: {
      type: String,
      required: true,
    },
    packageMeals: {
      type: String,
      required: true,
    },
    packageActivities: {
      type: String,
      required: true,
    },
    packagePrice: {
      type: Number,
      required: true,
    },

    packageDiscountPrice: {
      type: Number,
      required: true,
    },
    packageOffer: {
      type: Boolean,
      required: true,
    },
    packageRating: {
      type: Number,
      default: 0,
    },
    packageTotalRatings: {
      type: Number,
      default: 0,
    },
    packageImages: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

const Package = mongoose.model("Package", packageSchema);

export default Package;
