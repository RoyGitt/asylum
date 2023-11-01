import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json("User created successfully");
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  try {
    if (!user) return next(errorHandler(404, "User does not exists!"));
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) return next(errorHandler(401, "Wrong Credentials!"));
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = user._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
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
      const { password: pass, ...rest } = user._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(user._doc);
    }
    const generatedPassword =
      Math.random.toString(36).slice(-8) + Math.random.toString(36).slice(-8);
    const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
    const newUser = await User({
      username,
      email,
      password: hashedPassword,
      avatar,
    });
    await newUser.save();
  } catch (error) {
    next(error);
  }
};
