import express from "express";
import {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getCurrentUser,
  logout
} from "../Controllers/authController.js";

const router = express.Router();

router.post("/register", register);

router.get("/verify-email/:token", verifyEmail);

router.post("/login", login);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

// Get currently logged-in user
router.get("/me", getCurrentUser);

router.post("/logout", logout); 

export default router;
