import express from "express";
import {
  registerStaff,
  loginStaff,
  getCurrentStaff,
  logoutStaff,
  staffCompleteTask,
  getAllStaff,
  getAssignedMaintenanceTasks,
} from "../Controllers/staffController.js";

const router = express.Router();

// 🔓 public
router.post("/register", registerStaff); // protect later (admin only)
router.post("/login", loginStaff);

// 🔒 protected
router.get("/me", getCurrentStaff);
router.post("/logout", logoutStaff);

router.get("/", getAllStaff);

// ================= TASK =================
// GET all tasks for a specific staff

router.post("/complete-task", staffCompleteTask);
router.get("/:staffId", getAssignedMaintenanceTasks);

export default router;