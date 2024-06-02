import mongoose from "mongoose";

export type GuideScheduleType = {
  scheduleName: string;
  userName: string;
  email: string;
  tourists: string[];
  destination: string[];
  date: Date;
};

const guideScheduleSchema = new mongoose.Schema<GuideScheduleType>(
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
    tourists: {
      type: [],
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

const guideSchedule = mongoose.model<GuideScheduleType>(
  "guideSChedule",
  guideScheduleSchema
);

export default guideSchedule;
