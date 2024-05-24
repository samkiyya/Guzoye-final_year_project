import { Request, Response } from "express";
import Booking from "../models/booking";
import Package from "../models/package";
import { ObjectId } from "mongodb";

// create new booking
export const bookPackage = async (req: Request, res: Response) => {
  try {
    const { packageDetails, buyer, totalPrice, guestSize, date } = req.body;
    if (req.userId !== buyer) {
      return res.status(401).send({
        success: false,
        message: "You can only buy on your account!",
      });
    }
    if (!packageDetails || !buyer || !totalPrice || !guestSize || !date) {
      return res.status(200).send({
        success: false,
        message: "All fields are required!",
      });
    }
    const validPackage = await Package.findById(packageDetails);
    if (!validPackage) {
      return res.status(404).send({
        success: false,
        message: "Package Not Found!",
      });
    }

    const newBooking = await Booking.create(req.body);
    if (newBooking) {
      return res.status(201).send({
        success: true,
        message: "Your tour is booked!",
      });
    } else {
      return res.status(500).send({
        success: false,
        message: "Something went wrong!",
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error!" });
    console.log(error);
  }
};

//get current bookings for Manager
export const getCurrentBookings = async (req: Request, res: Response) => {
  try {
    const searchTerm = req?.query?.searchTerm || "";
    const bookings = await Booking.find({
      date: { $gt: new Date().toISOString() },
      status: "Booked",
    })
      .populate("packageDetails")
      // .populate("buyer", "username email")
      .populate({
        path: "buyer",
        match: {
          $or: [
            { username: { $regex: searchTerm, $options: "i" } },
            { email: { $regex: searchTerm, $options: "i" } },
          ],
        },
      })
      .sort({ createdAt: "asc" });
    let bookingsFilterd: any = [];
    bookings.map((booking) => {
      if (booking.buyer !== null) {
        bookingsFilterd.push(booking);
      }
    });
    if (bookingsFilterd.length) {
      return res.status(200).send({
        success: true,
        bookings: bookingsFilterd,
      });
    } else {
      return res.status(200).send({
        success: false,
        message: "No Bookings Available",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//get current bookings for user by id
export const getUserCurrentBookings = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    if (req.userId !== id) {
      return res.status(401).send({
        success: false,
        message: "You can only get your own bookings!!",
      });
    }
    const searchTerm = req?.query?.searchTerm || "";

    const bookings = await Booking.find({
      buyer: new ObjectId(req?.params?.id),
      date: { $gt: new Date().toISOString() },
      status: "Booked",
    })
      // .populate("packageDetails")
      .populate({
        path: "packageDetails",
        match: {
          packageName: { $regex: searchTerm, $options: "i" },
        },
      })
      .populate("buyer", "username email")
      .sort({ createdAt: "asc" });
    let bookingsFilterd: any = [];
    bookings.map((booking) => {
      if (booking.packageDetails !== null) {
        bookingsFilterd.push(booking);
      }
    });
    if (bookingsFilterd.length) {
      return res.status(200).send({
        success: true,
        bookings: bookingsFilterd,
      });
    } else {
      return res.status(200).send({
        success: false,
        message: "No Bookings Available",
      });
    }
  } catch (error) {
    res.status(404).json({ success: true, message: "Not Found!" });
    console.log(error);
  }
};

// get all booking
export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const searchTerm = req?.query?.searchTerm || "";
    const bookings = await Booking.find({})
      .populate("packageDetails")
      // .populate("buyer", "username email")
      .populate({
        path: "buyer",
        match: {
          $or: [
            { username: { $regex: searchTerm, $options: "i" } },
            { email: { $regex: searchTerm, $options: "i" } },
          ],
        },
      })
      .sort({ createdAt: "asc" });
    let bookingsFilterd: any = [];
    bookings.map((booking) => {
      if (booking.buyer !== null) {
        bookingsFilterd.push(booking);
      }
    });
    if (bookingsFilterd.length) {
      return res.status(200).send({
        success: true,
        bookings: bookingsFilterd,
      });
    } else {
      return res.status(200).send({
        success: false,
        message: "No Bookings Available",
      });
    }
  } catch (error) {
    res.status(500).json({ success: true, message: "Internal server error!" });
    console.log(error);
  }
};

//get all bookings by user id
export const getAllUserBookings = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (req.userId !== id) {
      return res.status(401).send({
        success: false,
        message: "You can only get your own bookings!!",
      });
    }

    const searchTerm = req?.query?.searchTerm || "";
    const bookings = await Booking.find({
      buyer: new ObjectId(req?.params?.id),
    })
      // .populate("packageDetails")
      .populate({
        path: "packageDetails",
        match: {
          packageName: { $regex: searchTerm, $options: "i" },
        },
      })
      .populate("buyer", "username email")
      .sort({ createdAt: "asc" });
    let bookingsFilterd: any = [];
    bookings.map((booking) => {
      if (booking.packageDetails !== null) {
        bookingsFilterd.push(booking);
      }
    });
    if (bookingsFilterd.length) {
      return res.status(200).send({
        success: true,
        bookings: bookingsFilterd,
      });
    } else {
      return res.status(200).send({
        success: false,
        message: "No Bookings Available",
      });
    }
  } catch (error) {
    res.status(500).json({ success: true, message: "Internal server error!" });
    console.log(error);
  }
};

//delete booking history
export const deleteBookingHistory = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    if (req.userId !== id) {
      return res.status(401).send({
        success: false,
        message: "You can only delete your booking history!",
      });
    }
    const deleteHistory = await Booking.findByIdAndDelete(id);
    if (deleteHistory) {
      return res.status(200).send({
        success: true,
        message: "Booking History Deleted!",
      });
    } else {
      return res.status(500).send({
        success: false,
        message: "Something went wrong while deleting booking history!",
      });
    }
  } catch (error) {
    res.status(500).json({ success: true, message: "Internal server error!" });
    console.log(error);
  }
};

//cancel booking
export const cancelBooking = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    if (req.userId !== id) {
      return res.status(401).send({
        success: false,
        message: "You can only cancel your bookings!",
      });
    }
    const cancelBooking = await Booking.findByIdAndUpdate(
      id,
      {
        status: "Cancelled",
      },
      { new: true }
    );
    if (cancelBooking) {
      return res.status(200).send({
        success: true,
        message: "Booking Cancelled!",
      });
    } else {
      return res.status(500).send({
        success: false,
        message: "Something went wrong while cancelling booking!",
      });
    }
  } catch (error) {
    res.status(500).json({ success: true, message: "Internal server error!" });
    console.log(error);
  }
};
