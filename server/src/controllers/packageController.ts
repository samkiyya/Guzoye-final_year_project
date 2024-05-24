import { Request, Response } from "express";
import Package from "../models/package";
import dotenv from "dotenv";
import Booking from "../models/booking";
import { SortOrder } from "mongoose";
import axios from "axios";

dotenv.config();

// Create package
export const createPackage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      packageName,
      packageDescription,
      packageDestination,
      packageDays,
      packageNights,
      packageAccommodation,
      packageTransportation,
      packageMeals,
      packageActivities,
      packagePrice,
      packageDiscountPrice,
      packageOffer,
      packageImages,
    } = req.body;

    if (
      !packageName ||
      !packageDescription ||
      !packageDestination ||
      !packageAccommodation ||
      !packageTransportation ||
      !packageMeals ||
      !packageActivities ||
      packageOffer === undefined ||
      !packageImages
    ) {
      res.status(400).send({
        success: false,
        message: "All fields are required!",
      });
      return;
    }

    if (packagePrice < packageDiscountPrice) {
      res.status(400).send({
        success: false,
        message: "Regular price should be greater than discount price!",
      });
      return;
    }

    if (packagePrice <= 0 || packageDiscountPrice < 0) {
      res.status(400).send({
        success: false,
        message: "Price should be greater than 0!",
      });
      return;
    }

    if (packageDays <= 0 && packageNights <= 0) {
      res.status(400).send({
        success: false,
        message: "Provide days and nights!",
      });
      return;
    }

    const newPackage = await Package.create(req.body);
    if (newPackage) {
      res.status(201).send({
        success: true,
        message: "Package created successfully",
      });
    } else {
      res.status(500).send({
        success: false,
        message: "Something went wrong",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Server error",
    });
  }
};

// Get all packages
export const getPackages = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const searchTerm = (req.query.searchTerm as string) || "";
    const limit = parseInt(req.query.limit as string, 10) || 9;
    const startIndex = parseInt(req.query.startIndex as string, 10) || 0;
    const sort = (req.query.sort as string) || "createdAt";
    const order = (req.query.order as SortOrder) || "desc";
    const offer =
      req.query.offer === undefined || req.query.offer === "false"
        ? { $in: [false, true] }
        : req.query.offer === "true";

    const packages = await Package.find({
      $or: [
        { packageName: { $regex: searchTerm, $options: "i" } },
        { packageDestination: { $regex: searchTerm, $options: "i" } },
      ],
      packageOffer: offer,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    if (packages.length > 0) {
      res.status(200).send({
        success: true,
        packages,
      });
    } else {
      res.status(404).send({
        success: false,
        message: "No Packages yet",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Server error",
    });
  }
};

// Get package data
export const getPackageData = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const packageData = await Package.findById(req.params.id);
    if (!packageData) {
      res.status(404).send({
        success: false,
        message: "Package not found!",
      });
      return;
    }
    res.status(200).send({
      success: true,
      packageData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Server error",
    });
  }
};

// Update package
export const updatePackage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const findPackage = await Package.findById(req.params.id);
    if (!findPackage) {
      res.status(404).send({
        success: false,
        message: "Package not found!",
      });
      return;
    }

    const updatedPackage = await Package.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Package updated successfully!",
      updatedPackage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Server error",
    });
  }
};

// Delete package
export const deletePackage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deletePackage = await Package.findByIdAndDelete(req.params.id);
    if (deletePackage) {
      res.status(200).send({
        success: true,
        message: "Package Deleted!",
      });
    } else {
      res.status(404).send({
        success: false,
        message: "Package not found!",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Server error",
    });
  }
};

// Payment gateway API - Token generation
export const chapaTokenController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const chapaToken = await axios.post(
      `${process.env.CHAPA_TOKEN_URL}`,
      {
        amount: req.body.amount,
        currency: req.body.currency,
        email: req.body.email,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.CHAPA_API_KEY}`,
        },
      }
    );
    if (chapaToken.status === 200) {
      res.status(200).send({
        success: true,
        chapaToken: chapaToken.data,
      });
    } else {
      res.status(400).send({
        success: false,
        message: "Failed to generate token",
      });
    }
    console.log(chapaToken.data);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Failed to generate token",
    });
  }
};
