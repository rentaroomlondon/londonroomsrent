// controllers/attendanceController.js
import axios from "axios";
import Attendance from "../Models/Attendance.js";
import Staff from "../Models/Staff.js";
import { sendEmail } from "../utils/sendEmail.js";

// ✅ PKT TIME
const getPKTTime = () =>
  new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Karachi" })
  );

const getToday = () => getPKTTime().toISOString().split("T")[0];

export const getAddressFromLatLng = async (lat, lng) => {
  try {
    const res = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${process.env.OPENCAGE_API_KEY}`
    );

    if (res.data.results.length > 0) {
      return res.data.results[0].formatted;
    }

    return "Unknown location";
  } catch (err) {
    console.error("Geocoding error:", err.message);
    return "Location unavailable";
  }
};

// 🟢 CHECK-IN
export const checkIn = async (req, res) => {
  try {
    const { staffId, imageUrl, lat, lng } = req.body;

    const today = getToday();

    const existing = await Attendance.findOne({ staff: staffId, date: today });
    if (existing) {
      return res.status(400).json({ message: "Already checked in today" });
    }

    const staff = await Staff.findById(staffId);
    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    const now = getPKTTime();

    const lateTime = new Date(now);
    lateTime.setHours(14, 15, 0, 0);

    const isLate = now > lateTime;

    // 🚀 Get address (parallel safe)
    let address = "Location unavailable";
    if (lat && lng) {
      address = await getAddressFromLatLng(lat, lng);
    }

    const record = await Attendance.create({
      staff: staffId,
      date: today,
      checkIn: {
        time: now,
        image: imageUrl,
        location: { lat, lng, address }, // ✅ SAVE ADDRESS
      },
      isLate,
    });

    // 📧 Late alert
    if (isLate) {
      await sendEmail(
        "londonroomsrent2@gmail.com",
        "🚨 Late Check-in Alert",
        `
        <h2>🚨 Late Check-in Alert</h2>

        <p><b>Name:</b> ${staff.name}</p>
        <p><b>Email:</b> ${staff.email}</p>
        <p><b>Staff ID:</b> ${staff._id}</p>

        <hr/>

        <p><b>Check-in Time:</b> ${now.toLocaleTimeString()}</p>
        <p><b>Date:</b> ${today}</p>

        <p><b>Location:</b> ${address}</p>

        <p><b>Map:</b> 
        <a href="https://www.google.com/maps?q=${lat},${lng}" target="_blank">
        View on Map</a></p>

        <p><b>Image:</b></p>
        <img src="${imageUrl}" width="200"/>
        `
      );
    }

    res.status(200).json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔴 CHECK-OUT
export const checkOut = async (req, res) => {
  try {
    const { staffId, imageUrl, lat, lng } = req.body;

    const today = getToday();

    // 🔍 Find today's attendance
    const record = await Attendance.findOne({
      staff: staffId,
      date: today,
    });

    if (!record || !record.checkIn) {
      return res.status(400).json({ message: "No check-in found" });
    }

    // 🔍 Get staff
    const staff = await Staff.findById(staffId);
    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    const now = getPKTTime();

    // ⏱️ Calculate work duration
    const totalMinutes = Math.floor(
      (now - new Date(record.checkIn.time)) / 60000
    );

    // ⏰ Expected checkout time (10 PM)
    const expectedCheckout = new Date(now);
    expectedCheckout.setHours(22, 0, 0, 0);

    const isEarly = now < expectedCheckout;

    // 🚀 Reverse geocode (non-blocking start)
    const addressPromise =
      lat && lng
        ? getAddressFromLatLng(lat, lng)
        : Promise.resolve("Location unavailable");

    // 📝 Update record first (fast response)
    record.checkOut = {
      time: now,
      image: imageUrl,
      location: { lat, lng }, // address add later
    };

    record.totalMinutes = totalMinutes;
    record.earlyCheckout = isEarly;

    await record.save();

    // ⏳ Now resolve address (after DB save)
    const address = await addressPromise;

    // ✅ Update address separately (optional but recommended)
    record.checkOut.location.address = address;
    await record.save();

    // 📧 Send email if early checkout
    if (isEarly) {
      await sendEmail(
        "londonroomsrent2@gmail.com",
        "⚠️ Early Checkout Alert",
        `
        <h2>⚠️ Early Checkout Alert</h2>

        <p><b>Name:</b> ${staff.name}</p>
        <p><b>Email:</b> ${staff.email}</p>
        <p><b>Staff ID:</b> ${staff._id}</p>

        <hr/>

        <p><b>Check-in:</b> ${new Date(
          record.checkIn.time
        ).toLocaleTimeString()}</p>
        <p><b>Check-out:</b> ${now.toLocaleTimeString()}</p>

        <p><b>Total Work:</b> ${Math.floor(totalMinutes / 60)}h ${
          totalMinutes % 60
        }m</p>

        <p><b>Location:</b> ${address}</p>

        <p><b>Map:</b> 
        <a href="https://www.google.com/maps?q=${lat},${lng}" target="_blank">
        View on Map</a></p>

        <p><b>Image:</b></p>
        <img src="${imageUrl}" width="200"/>
        `
      );
    }

    res.status(200).json(record);
  } catch (err) {
    console.error("Checkout error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 📊 GET TODAY
export const getTodayAttendance = async (req, res) => {
  try {
    const { staffId } = req.body;

    const today = getToday();

    const record = await Attendance.findOne({
      staff: staffId,
      date: today,
    });

    res.status(200).json(record || {});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin Get Attendance
export const getAttendance = async (req, res) => {
  try {
    const { date, startDate, endDate, month, year } = req.query;

    let filter = {};

    // 📅 Specific date
    if (date) {
      filter.date = date;
    }

    // 📅 Date range
    if (startDate && endDate) {
      filter.date = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    // 📅 Month filter (e.g. month=4&year=2026)
    if (month && year) {
      const start = new Date(year, month - 1, 1)
        .toISOString()
        .split("T")[0];

      const end = new Date(year, month, 0)
        .toISOString()
        .split("T")[0];

      filter.date = {
        $gte: start,
        $lte: end,
      };
    }

    // 🔍 Fetch all attendance
    const records = await Attendance.find(filter)
      .populate("staff", "name email role")
      .sort({ date: -1, createdAt: -1 });

    res.status(200).json({
      total: records.length,
      data: records,
    });
  } catch (err) {
    console.error("Get attendance error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Today Attendence Staff Admin
export const getTodayAllAttendance = async (req, res) => {
  try {
    const today = getToday();

    const records = await Attendance.find({ date: today })
      .populate("staff", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      total: records.length,
      data: records,
    });
  } catch (err) {
    console.error("Today attendance error:", err);
    res.status(500).json({ message: err.message });
  }
};