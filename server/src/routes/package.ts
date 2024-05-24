import express from "express";
import { verifyRole, verifyToken } from "../middleware/auth";
import {
  createPackage,
  deletePackage,
  getPackageData,
  getPackages,
  updatePackage,
} from "../controllers/packageController";

const router = express.Router();

//create package
router.post(
  "/create-package",
  verifyToken,
  verifyRole(["manager"]),
  createPackage
);

//update package by id
router.post(
  "/update-package/:id",
  verifyToken,
  verifyRole(["manager"]),
  updatePackage
);

//delete package by id
router.delete(
  "/delete-package/:id",
  verifyToken,
  verifyRole(["manager"]),
  deletePackage
);

//get all packages
router.get("/get-packages", getPackages);

//get single package data by id
router.get("/get-package-data/:id", getPackageData);

export default router;
