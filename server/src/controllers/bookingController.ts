import { Request, Response } from "express";
import Booking from "../models/booking";
import Package, { PackageType } from "../models/package";
import { ObjectId } from "mongodb";

// Utility Function
function calcPrices(travels: any) {
  const travelsPrice = travels.reduce(
    (acc: any, item: any): any => acc + item.packagePrice * item.qty,
    0
  );
  const taxRate = 0.15;
  const taxPrice = (travelsPrice * taxRate).toFixed(2);
  const totalPrice = (travelsPrice + parseFloat(taxPrice)).toFixed(2);

  return {
    travelsPrice: travelsPrice.toFixed(2),
    taxPrice,
    totalPrice,
  };
}

// Create new booking
const bookPackage = async (req: Request, res: Response) => {
  try {
    const { BookingTravels, travelerAddress, paymentMethod, user, guestSize } =
      req.body;

    if (req.userId !== user) {
      return res.status(401).send({
        success: false,
        message: "You can only book with your own account!",
      });
    }

    if (BookingTravels && BookingTravels.length === 0) {
      return res.status(400).send({
        success: false,
        message: "There are no booked travels",
      });
    }

    const packageIds = BookingTravels.map((x: any) => x._id);
    const validPackages = (await Package.find({
      _id: { $in: packageIds },
    })) as (PackageType & { _id: ObjectId })[];

    if (validPackages.length !== BookingTravels.length) {
      return res.status(404).send({
        success: false,
        message: "One or more packages not found!",
      });
    }

    const dbOrderItems = BookingTravels.map((itemFromClient: any) => {
      const matchingItemFromDB = validPackages.find(
        (packageItem: any) => packageItem._id.toString() === itemFromClient._id
      );

      if (!matchingItemFromDB) {
        throw new Error(`Package not found: ${itemFromClient._id}`);
      }

      return {
        ...itemFromClient,
        product: itemFromClient._id,
        packagePrice: matchingItemFromDB.packagePrice, // Ensure this line is accessing the 'packagePrice' field
        _id: undefined,
      };
    });

    const { travelsPrice, taxPrice, totalPrice } = calcPrices(dbOrderItems);

    const newBooking = new Booking({
      BookingTravels: dbOrderItems,
      user: req.userId,
      travelerAddress,
      paymentMethod,
      travelsPrice,
      taxPrice,
      totalPrice,
      guestSize,
    });

    const createBook = await newBooking.save();

    if (createBook) {
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
    console.error("Error creating booking:", error);
    res.status(500).json({ success: false, message: "Internal server error!" });
  }
};

// Count total orders
const countTotalOrders = async (req: Request, res: Response) => {
  try {
    const totalOrders = await Booking.countDocuments();
    res.json({ success: true, totalOrders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Calculate total sales
const calculateTotalSales = async (req: Request, res: Response) => {
  try {
    const orders = await Booking.find();
    const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    res.json({ success: true, totalSales });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Calculate total sales by date
const calculateTotalSalesByDate = async (req: Request, res: Response) => {
  try {
    const salesByDate = await Booking.aggregate([
      {
        $match: {
          isPaid: true,
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$paidAt" },
          },
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);

    res.json({ success: true, salesByDate });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get current bookings for user by ID
const getUserCurrentBookings = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    if (req.userId !== id) {
      return res.status(401).send({
        success: false,
        message: "You can only get your own bookings!",
      });
    }

    const searchTerm = req.query.searchTerm || "";

    const bookings = await Booking.find({
      buyer: new ObjectId(id),
      date: { $gt: new Date().toISOString() },
      status: "Booked",
    })
      .populate({
        path: "packageDetails",
        match: {
          packageName: { $regex: searchTerm, $options: "i" },
        },
      })
      .populate("buyer", "username email")
      .sort({ createdAt: "asc" });

    const filteredBookings = bookings.filter(
      (booking) => booking.BookingTravels !== null
    );

    if (filteredBookings.length) {
      return res.status(200).send({
        success: true,
        bookings: filteredBookings,
      });
    } else {
      return res.status(200).send({
        success: false,
        message: "No bookings available",
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error!" });
    console.error(error);
  }
};

// Get all bookings
const getAllBookings = async (req: Request, res: Response) => {
  try {
    const searchTerm = req.query.searchTerm || "";

    const bookings = await Booking.find({})
      .populate("BookingTravels")
      .populate({
        path: "user",
        match: {
          $or: [
            { username: { $regex: searchTerm, $options: "i" } },
            { email: { $regex: searchTerm, $options: "i" } },
          ],
        },
      })
      .sort({ createdAt: "asc" });

    const filteredBookings = bookings.filter(
      (booking) => booking.user !== null
    );

    if (filteredBookings.length) {
      return res.status(200).send({
        success: true,
        bookings: filteredBookings,
      });
    } else {
      return res.status(200).send({
        success: false,
        message: "No bookings available",
      });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Internal server error!" });
    console.error(error.message);
  }
};

// Get all bookings by user ID
const getAllUserBookings = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (req.userId !== id) {
      return res.status(401).send({
        success: false,
        message: "You can only get your own bookings!",
      });
    }

    const searchTerm = req.query.searchTerm || "";

    const bookings = await Booking.find({
      buyer: new ObjectId(id),
    })
      .populate({
        path: "packageDetails",
        match: {
          packageName: { $regex: searchTerm, $options: "i" },
        },
      })
      .populate("buyer", "username email")
      .sort({ createdAt: "asc" });

    const filteredBookings = bookings.filter(
      (booking) => booking.BookingTravels !== null
    );

    if (filteredBookings.length) {
      return res.status(200).send({
        success: true,
        bookings: filteredBookings,
      });
    } else {
      return res.status(200).send({
        success: false,
        message: "No bookings available",
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error!" });
    console.error(error);
  }
};

// Mark order as paid
const markOrderAsPaid = async (req: Request, res: Response) => {
  try {
    const order = await Booking.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = new Date(Date.now());
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address,
      };

      const updateBooking = await order.save();
      res.status(200).json({ success: true, updateBooking });
    } else {
      res.status(404).json({ success: false, message: "Booking not found" });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete booking history
const deleteBookingHistory = async (req: Request, res: Response) => {
  const { id } = req.params;
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
        message: "Booking history deleted!",
      });
    } else {
      return res.status(500).send({
        success: false,
        message: "Something went wrong while deleting booking history!",
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error!" });
    console.error(error);
  }
};

// Cancel booking
const cancelBooking = async (req: Request, res: Response) => {
  const { id } = req.params;
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
        message: "Booking cancelled!",
      });
    } else {
      return res.status(500).send({
        success: false,
        message: "Something went wrong while cancelling booking!",
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error!" });
    console.error(error);
  }
};

export {
  bookPackage,
  countTotalOrders,
  calculateTotalSales,
  calculateTotalSalesByDate,
  getUserCurrentBookings,
  getAllBookings,
  getAllUserBookings,
  markOrderAsPaid,
  deleteBookingHistory,
  cancelBooking,
};
