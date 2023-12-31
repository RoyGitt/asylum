import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcrypt from "bcrypt";
import Listing from "../models/listing.model.js";

export const test = (req, res) => {
  res.json({ message: "Test" });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only update your own account 😂"));

  if (
    !req.body.username &&
    !req.body.email &&
    !req.body.password &&
    !req.body.avatar
  ) {
    return next(errorHandler(400, "Nothing to Update"));
  }

  try {
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }

    const existingUsername = await User.findOne({
      username: req.body.username,
    });

    if (existingUsername) {
      return next(errorHandler(400, "Username is already taken"));
    }

    const existingEmail = await User.findOne({
      email: req.body.email,
    });
    if (existingEmail) {
      return next(
        errorHandler(400, "An account is already created with that email")
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler("401", "You can only update your own account 😂"));
  }
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(204).json({ message: "Successfully Deleted" });
  } catch (error) {
    next(error);
  }
};

export const getUserPost = async (req, res, next) => {
  if (req.params.id !== req.user.id) {
    return next(errorHandler("401", "You can only view your own listings 🌚"));
  }

  try {
    const listings = await Listing.find({ userRef: req.params.id });

    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const userData = await User.findById(req.params.id);

    if (!userData) {
      return next(errorHandler("404", "User does not exists"));
    }

    const { password: pass, ...modifiedUserData } = userData._doc;

    res.status(200).json(modifiedUserData);
  } catch (error) {
    next(error);
  }
};
