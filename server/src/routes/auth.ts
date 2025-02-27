import express, { Request, Response } from "express";
import { verifyToken } from "../middleware/auth";
import {
  googleAuth,
  login,
  logout,
  register,
} from "../controllers/authController";

const router = express.Router();

//registration route
router.post("/register", register);

//login route
router.post("/login", login);

//login route using google auth
router.post("/google", googleAuth);

// token validation route
router.get("/validate-token", verifyToken, (req: Request, res: Response) => {
  res.status(200).send({ userId: req.userId });
});

//logout route
router.post("/logout", logout);

export default router;
