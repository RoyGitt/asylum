import { ObjectId } from "mongodb";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcrypt from "bcrypt";

export const test = (req, res) => {
  res.json({ message: "Test" });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only update your own account!"));

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
    next(errorHandler("401", "You can only update your own account"));
  }
  try {
    await User.findByIdAndDelete(req.params.id);
  } catch (error) {
    next(error);
  }
};
