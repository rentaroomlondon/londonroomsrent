// routes/attendanceRoutes.js
import express from "express";
import { checkIn, checkOut, getAttendance, getTodayAllAttendance, getTodayAttendance } from "../Controllers/attendanceController.js";

const router = express.Router();

router.post("/checkin", checkIn);
router.post("/checkout", checkOut);
router.post("/today", getTodayAttendance);
router.get("/staff", getAttendance);
// 📅 Today
router.get("/staff/today", getTodayAllAttendance);

export default router;