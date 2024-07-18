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
    firstName: {
      type: String,
      required: [true, "First name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password required"],
      minLength: [8, "Minimum password length is 8 character"],
    },
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

// hashing the password before save
userSchema.pre<UserType>("save", async function (next) {
  try {
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    next();
  } catch (error: any) {
    next(error);
  }
});

const User: Model<UserType> = mongoose.model<UserType>("User", userSchema);
export default User;
