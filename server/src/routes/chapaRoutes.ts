// routes/chapaRoutes.ts
import express from "express";
import { initializePayment, handleCallback } from "../controllers/chapaPayment";

const router = express.Router();

router.post("/chapa", initializePayment);
router.post("/callback", handleCallback);

export default router;
