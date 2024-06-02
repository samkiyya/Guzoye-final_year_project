import mongoose from "mongoose";

export type UserScheduleType = {
  scheduleName: string;
  userName: string;
  email: string;
  destination: string[];
  date: Date;
};

const userScheduleSchema = new mongoose.Schema<UserScheduleType>(
  {
    scheduleName: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    destination: {
      type: [],
      required: true,
    },
    date: {
      type: Date,
    },
  },
  { timestamps: true }
);

const userSchedule = mongoose.model<UserScheduleType>(
  "userSChedule",
  userScheduleSchema
);

export default userSchedule;
