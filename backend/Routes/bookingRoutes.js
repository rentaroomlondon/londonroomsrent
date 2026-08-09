import express from "express";
import {
  createBooking,
  getAllBookings,
  getMyBookings,
  updateBooking,
} from "../Controllers/bookingController.js";

const router = express.Router();

router.post("/", createBooking);
router.get("/my/:userId", getMyBookings);
router.get("/", getAllBookings);
router.put("/:id", updateBooking);

export default router;