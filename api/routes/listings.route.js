import express from "express";
import {
  createListing,
  deleteListing,
  updateListing,
} from "../controllers/listings.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/create-listing", createListing);
router.delete("/delete-listing/:id", verifyToken, deleteListing);
router.post("/update-listing/:id", verifyToken, updateListing);

export default router;
