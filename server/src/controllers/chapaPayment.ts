// controllers/chapaPayment.ts
import { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY;

export const initializePayment = async (req: Request, res: Response) => {
  const { totalPrice, email, first_name, packageName } = req.body;

  try {
    const chapaRes = await axios.post(
      "https://api.chapa.co/v1/transaction/initialize",
      {
        amount: totalPrice,
        currency: "ETB",
        email: email,
        first_name: first_name,
        tx_ref: `tx-${Date.now()}`,
        callback_url: "https://yourdomain.com/callback",
        return_url: "https://yourdomain.com/return",
        customization: {
          title: "Booking Payment",
          description: `Payment for booking ${packageName}`,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
        },
      }
    );

    if (chapaRes.data.status === "success") {
      res
        .status(200)
        .json({ success: true, checkout_url: chapaRes.data.data.checkout_url });
    } else {
      res
        .status(500)
        .json({ success: false, message: "Payment initialization failed!" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
