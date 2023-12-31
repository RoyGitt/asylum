import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
  if (
    req.body.username.trim().length === 0 ||
    req.body.email.trim().length === 0 ||
    req.body.password.trim().length === 0
  ) {
    return next(errorHandler(422, "Please provide all required information."));
  }
  try {
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      return next(
        errorHandler(409, "User already exists with the provided information.")
      );
    }

    const existingEmail = await User.findOne({ email: req.body.email });
    if (existingEmail) {
      return next(
        errorHandler(409, "User already exists with the provided information.")
      );
    }

    const { username, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = await User({ username, email, password: hashedPassword });
    await newUser.save();
    const { password: pass, ...rest } = newUser._doc;
    res.status(201).json(rest);
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  if (
    req.body.email.trim().length === 0 ||
    req.body.password.trim().length === 0
  ) {
    return next(errorHandler(422, "Please provide all required information."));
  }
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  try {
    if (!user) return next(errorHandler(404, "User does not exists!"));
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) return next(errorHandler(401, "Wrong Credentials!"));
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    const { password: pass, ...modifiedData } = user._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(modifiedData);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const { username, email, avatar } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...modifiedData } = user._doc;
      return res
        .cookie("access_token", token, { httpOnly: true })
        .status(201)
        .json(modifiedData);
    }
    const generatedPassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);
    const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
    const modifiedUsername =
      username.split(" ").join("") + Math.random().toString(36).slice(-4);
    const newUser = await User({
      username: modifiedUsername,
      email,
      password: hashedPassword,
      avatar,
    });
    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
    const { password: newPass, ...newUserData } = newUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(newUserData);
  } catch (error) {
    next(error);
  }
};

export const signOut = (req, res) => {
  if (req.user.id === req.params.id)
    return next(
      errorHandler(401, "You can only logout from your own account 😂")
    );
  try {
    res.clearCookie("access_token");
    res.status(204).json({ message: "Signed out successfully" });
  } catch (error) {
    next(error);
  }
};
