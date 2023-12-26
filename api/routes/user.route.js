import express from "express";
import { test, updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/VerifyToken.js";

const router = express.Router();

router.get("/test", test);
router.get("/update-user/:id", verifyToken, updateUser);

export default router;
