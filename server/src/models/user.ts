import mongoose from "mongoose";
import bcrypt from "bcryptjs";
export type UserType = {
  _id: string;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  photo: string;
  role: string;
  createdAt?: Date; // Optional, added because of timestamps: true in schema
  updatedAt?: Date; // Optional, added because of timestamps: true in schema
};

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },

    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    photo: {
      type: String,
    },

    role: {
      type: String,
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

//hashing the password before save

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});
const User = mongoose.model<UserType>("User", userSchema);
export default User;
