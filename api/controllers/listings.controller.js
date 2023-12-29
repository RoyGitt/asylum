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
    return next(
      errorHandler("401", "You can only delete your own listings 😂")
    );
  }
  try {
    await Listing.findOneAndDelete({ userRef: req.params.id });
    res.status(200).json({ message: "Deleted Successfully" });
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  try {
    const listings = await Listing.findById(req.params.id);
    if (!listings) {
      return next(errorHandler("404", "Listing not found!"));
    }

    if (listings.userRef !== req.user.id) {
      return next(
        errorHandler("401", "You can only delete your own listings 😂")
      );
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};
