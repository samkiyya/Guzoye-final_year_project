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
      usrId: req.userId, // Assuming verifyToken middleware sets req.userId
    };

    // Save the new tour to the database
    const tour = new Tour(newTour);
    await tour.save();

    res
      .status(201)
      .json({ success: true, message: "Successfully created", data: tour });
  } catch (e) {
    console.error("Error creating Tour: ", e);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Update Tour
export const updateTour = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedTour = await Tour.findByIdAndUpdate(
      id,
      { $set: req.body },
      {
        new: true,
      }
    );
    if (!updatedTour) {
      return res.status(404).json({ message: "Tour not found" });
    }
    res.status(200).json({
      success: true,
      message: "Successfully updated",
      data: updatedTour,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error updating tour", data: error });
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
    res
      .status(200)
      .json({ success: true, message: "Tour deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error deleting tour", data: error });
  }
};
//get a single tour
export const getSingleTour = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const tour = await Tour.findById(id).populate("reviews");
    res.status(200).json({
      success: true,
      message: "Tour fetched successfully",
      data: tour,
    });
  } catch (error) {
    res
      .status(404)
      .json({ success: false, message: "Error fetching tours", data: error });
  }
};

// Get Tours
export const getTours = async (req: Request, res: Response) => {
  //for pagination    let page = parseInt(req.query.page as string, 10) || 0;

  try {
    // Parse page number from query string
    let page = parseInt(req.query.page as string, 10) || 0;
    console.log(page);

    // Validate page number
    if (isNaN(page) || page < 0) {
      return res.status(400).json({ message: "Invalid page number" });
    }
    const limit = 8; // Number of tours per page
    const skip = page * limit;

    // Fetch tours with pagination
    const tours = await Tour.find({})
      .populate("reviews")
      .skip(skip)
      .limit(limit);
    res.status(200).json({
      success: true,
      count: tours.length,
      message: "Tour fetched successfully",
      data: tours,
    });
  } catch (error: any) {
    console.error("Error fetching tours:", error);
    res
      .status(404)
      .json({ message: "Error fetching tours", error: error.message });
  }
};

// Get Tours by searching
export const getTourBySearch = async (req: Request, res: Response) => {
  // 'i' means case sensetive
  const city = new RegExp(req.query.city as string, "i");
  const distance = parseInt(req.query.distance as string, 10);
  const maxGroupSize = parseInt(req.query.maxGroupSize as string, 10);
  try {
    const tours = await Tour.find({
      city,
      distance: { $gte: distance },
      maxGroupSize: { $gte: maxGroupSize },
    }).populate("reviews");
    res.status(200).json({
      success: true,
      message: "Tour fetched successfully",
      data: tours,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: "Error fetching tours",
      error: error.message,
    });
  }
};

// GetFeatured tours
export const getFeaturedTour = async (req: Request, res: Response) => {
  try {
    const tours = await Tour.find({ featured: true })
      .populate("reviews")
      .limit(8);
    res.status(200).json({
      success: true,
      message: "Tour fetched successfully",
      data: tours,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: "Error fetching tours",
      error: error.message,
    });
  }
};

// get tours count
export const getTourCount = async (req: Request, res: Response) => {
  try {
    const tourCount = await Tour.estimatedDocumentCount();
    res.status(200).json({
      success: true,
      data: tourCount,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to Fetch fetching tours",
      error: error.message,
    });
  }
};
