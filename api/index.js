import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MONGO");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.listen(3000, () => {
  console.log("Server is running at PORT 3000");
});
