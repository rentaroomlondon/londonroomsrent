import Maintenance from "../Models/Maintenance.js";
import Staff from "../Models/Staff.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";

// 🔑 Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

// ✅ Register Staff (admin should call this)
export const registerStaff = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const staffExists = await Staff.findOne({ email });
    if (staffExists) {
      return res.status(400).json({ message: "Staff already exists" });
    }

    const staff = await Staff.create({
      name,
      email,
      password,
      role, // 🔥 maintenance / listing
    });

    const token = generateToken(staff._id);

    res.status(201).json({
      message: "Staff registered successfully",
      token,
      staff: {
        id: staff._id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginStaff = async (req, res) => {
  try {
    const { email, password } = req.body;

    const staff = await Staff.findOne({ email }).select("+password");

    if (!staff) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await staff.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(staff._id);

    // ✅ COOKIE (separate from admin)
    res.cookie("staffToken", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      staff: {
        id: staff._id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCurrentStaff = async (req, res) => {
  try {
    const token = req.cookies.staffToken;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const staff = await Staff.findById(decoded.id).select("-password");

    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    res.json({ success: true, staff });
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const logoutStaff = (req, res) => {
  try {
    res.clearCookie("staffToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.json({
      success: true,
      message: "Staff logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error while logging out",
    });
  }
};

// ================= GET ALL STAFF =================
export const getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.find().select("_id name role email").lean();
    res.json({ success: true, staff });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================= STAFF COMPLETES TASK =================
export const staffCompleteTask = async (req, res) => {
  try {
    const { maintenanceId, staffId } = req.body;

    const maintenance = await Maintenance.findById(maintenanceId);
    if (!maintenance) return res.status(404).json({ success: false, message: "Task not found" });

    if (!maintenance.assignedStaff || maintenance.assignedStaff.toString() !== staffId) {
      return res.status(403).json({ success: false, message: "Not authorized for this task" });
    }

    maintenance.status = "Completed";
    await maintenance.save();

    // Email tenant
    if (maintenance.email) {
      await sendEmail(
        maintenance.email,
        "Maintenance Completed",
        `<p>Your maintenance task has been completed:</p><p>${maintenance.description}</p>`
      );
    }

    res.json({ success: true, message: "Task marked completed", maintenance });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================= GET TASKS ASSIGNED TO STAFF =================
export const getAssignedMaintenanceTasks = async (req, res) => {
  try {
    const { staffId } = req.params; // 👉 now coming from URL

    if (!staffId) {
      return res.status(400).json({ message: "staffId missing" });
    }

    const tasks = await Maintenance.find({
      assignedStaff: staffId,
    })
      .populate("user", "firstName lastName email")
      .populate("assignedStaff", "name email")
      .sort({ deadline: 1 });

    return res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};