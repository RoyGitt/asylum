import express from "express";
import { createListing } from "../controllers/listings.controller.js";

const router = express.Router();

router.post("/create-listing", createListing);

export default router;
