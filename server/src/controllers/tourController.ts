import { Request, Response } from "express";
import tour from "../models/tour";

// create new tour
export const createTour = async (req: Request, res: Response) => {
  const newTour = new tour(req.body);
  try {
    const savedTour = await newTour.save();
    res
      .status(201)
      .json({ success: true, message: "successfuly created", data: savedTour });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to create. Try again!" });
  }
};
