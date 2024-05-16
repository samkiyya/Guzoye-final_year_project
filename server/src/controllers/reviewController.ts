import Tour from "../models/tour";
import Review from "../models/review";
import { Request, Response } from "express";

export const createReview = async (req: Request, res: Response) => {
  const tourId = req.params.tourId;
  const newReview = new Review({ ...req.body });

  try {
    const savedReview = await newReview.save();

    // after creating a new review now update the reviews array of the tour
    await Tour.findByIdAndUpdate(tourId, {
      $push: { reviews: savedReview._id },
    });

    res
      .status(200)
      .json({ success: true, message: "Review submitted", data: savedReview });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to submit" });
  }
};
