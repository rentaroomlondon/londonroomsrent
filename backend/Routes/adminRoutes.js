import express from "express";
import { registerAdmin, loginAdmin, getCurrentAdmin, logoutAdmin } from "../Controllers/adminController.js";

const router = express.Router();

// ⚠️ Use register only once (or protect it later)
router.post("/register", registerAdmin);

// 🔐 Login
router.post("/login", loginAdmin);

// 👑 Get logged-in admin
router.get("/me", getCurrentAdmin);

// 🔐 Logout admin
router.post("/logout", logoutAdmin);

export default router;