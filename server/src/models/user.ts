import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface UserType extends Document {
  username: string;
  email: string;
  password: string;
  availability: string;
  firstName: string;
  lastName: string;
  skill: string;
  userProfileImg: string;
  isEthiopian: boolean;
  role: "admin" | "traveller" | "manager" | "guide";
  createdAt?: Date; // Optional, added because of timestamps: true in schema
  updatedAt?: Date; //
}

const userSchema = new mongoose.Schema<UserType>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    skill: {
      type: String,
    },
    availability: {
      type: String,
    },
    userProfileImg: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
    isEthiopian: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: "traveller",
    },
  },
  {
    timestamps: true,
  }
);

// // hashing the password before save
// userSchema.pre<UserType>("save", async function (next) {
//   if (this.isModified("password")) {
//     this.password = await bcrypt.hash(this.password, 8);
//   }
//   next();
// });

const User: Model<UserType> = mongoose.model<UserType>("User", userSchema);
export default User;
