import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    next(errorHandler("401", "You can only delete your own listings"));
  }
  try {
    await Listing.findOneAndDelete({ userRef: req.params.id });
    res.json({ message: "Deleted Successfully" });
  } catch (error) {
    next(error);
  }
};
