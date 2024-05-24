import express, { Request, Response } from "express";
import { check } from "express-validator";
import { verifyToken } from "../middleware/auth";
import {
  googleAuth,
  login,
  logout,
  register,
} from "../controllers/authController";

const router = express.Router();

//registration route
router.post(
  "/register",
  [
    check("firstName", "First name is required").isString(),
    check("lastName", "Last name is required").isString(),
    check("username", "User name is required").isString(),
    check("email", "Email is required").isString(),
    check("password", "password 8 or more character is required").isLength({
      min: 8,
    }),
  ],
  register,
  () => console.log("registration hited")
);

//login route
router.post(
  "/login",
  [
    check("email", "Email is required")
      .optional()
      .custom((value, { req }) => {
        if (req.body.username && !value) {
          throw new Error("Email is required if username is provided");
        }
        return true;
      }),
    check("password", "Password must be at least 8 characters long")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
    check("username", "Username is required")
      .optional()
      .custom((value, { req }) => {
        if (req.body.email && !value) {
          throw new Error("Username is required if email is provided");
        }
        return true;
      }),
  ],
  login
);

//login route using google auth
router.post("/google", googleAuth);

// token validation route
router.get("/validate-token", verifyToken, (req: Request, res: Response) => {
  res.status(200).send({ userId: req.userId });
});

//logout route
router.post("/logout", verifyToken, logout);

export default router;
