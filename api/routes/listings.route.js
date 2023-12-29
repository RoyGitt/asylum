import express from "express";
import {
  createListing,
  deleteListing,
} from "../controllers/listings.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/create-listing", createListing);
router.delete("/delete-listing/:id", verifyToken, deleteListing);

export default router;
