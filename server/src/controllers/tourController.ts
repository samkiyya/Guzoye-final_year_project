import { Request, Response } from "express";
import cloudinary from "cloudinary";
import Tour, { TourType } from "../models/tour";

// Create Tour
export const createTour = async (req: Request, res: Response) => {
  const {
    title,
    city,
    address,
    distance,
    desc,
    price,
    featured,
    reviews,
    createdAt,
    lastUpdated,
  } = req.body;

  try {
    const imageFiles = req.files as Express.Multer.File[];

    // Upload the images to Cloudinary
    const uploadPromises = imageFiles.map(async (image) => {
      const b64 = Buffer.from(image.buffer).toString("base64");
      let dataURI = "data:" + image.mimetype + ";base64," + b64;
      try {
        const result = await cloudinary.v2.uploader.upload(dataURI);
        return result.url;
      } catch (err) {
        console.error("Cloudinary upload error:", err);
        throw new Error("Image upload failed");
      }
    });

    const imageUrls = await Promise.all(uploadPromises);

    const newTour = <TourType>{
      title,
      city,
      address,
      distance,
      desc,
      price,
      featured,
      reviews,
      photo: imageUrls,
      createdAt,
      lastUpdated: new Date(),
      usrId: req.userId, // Assuming verifyToken middleware sets req.userId
    };

    // Save the new tour to the database
    const tour = new Tour(newTour);
    await tour.save();

    res
      .status(201)
      .send({ success: true, message: "Successfully created", data: tour });
  } catch (e) {
    console.error("Error creating Tour: ", e);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Update Tour
export const updateTour = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedTour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedTour) {
      return res.status(404).json({ message: "Tour not found" });
    }
    res.status(200).json(updatedTour);
  } catch (error) {
    res.status(500).json({ message: "Error updating tour", error });
  }
};

// Delete Tour
export const deleteTour = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedTour = await Tour.findByIdAndDelete(id);
    if (!deletedTour) {
      return res.status(404).json({ message: "Tour not found" });
    }
    res.status(200).json({ message: "Tour deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting tour", error });
  }
};

// Get Tours
export const getTours = async (req: Request, res: Response) => {
  try {
    const tours = await Tour.find();
    res.status(200).json(tours);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tours", error });
  }
};
