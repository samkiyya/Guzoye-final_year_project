// routes/chapaRoutes.ts
import express from "express";
import { initializePayment } from "../controllers/chapaPayment";

const router = express.Router();

router.post("/initialize-payment", initializePayment);

export default router;
