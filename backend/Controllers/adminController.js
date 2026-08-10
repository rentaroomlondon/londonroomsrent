import Admin from "../Models/admin.js";
import jwt from "jsonwebtoken";

// 🔑 Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

// ✅ Register Admin
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const admin = await Admin.create({ name, email, password });
    const token = generateToken(admin._id);

    res.status(201).json({
      message: "Admin registered successfully",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Login Admin
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("=== ADMIN LOGIN ATTEMPT ===");
    console.log("Origin:", req.headers.origin);
    console.log("CLIENT_URL:", process.env.CLIENT_URL);

    const admin = await Admin.findOne({ email }).select("+password");

    if (!admin) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(admin._id);

    // Still try to set cookie (good for same-site later)
    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });

    // Also return the token in body (this will fix your live issue)
    res.status(200).json({
      message: "Login successful",
      token, // ← important
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Current Admin (supports both Cookie + Bearer)
export const getCurrentAdmin = async (req, res) => {
  try {
    console.log("=== GET CURRENT ADMIN ===");
    console.log("Cookies:", req.cookies);
    console.log("Authorization:", req.headers.authorization);

    // 1. Try cookie first
    let token = req.cookies.adminToken;

    // 2. Fallback to Bearer token
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      console.log("❌ No token found (cookie or header)");
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select("-password");

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    console.log("✅ Admin authenticated:", admin.email);
    res.json({ success: true, admin });
  } catch (error) {
    console.error("getCurrentAdmin error:", error.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// ✅ Logout
export const logoutAdmin = (req, res) => {
  try {
    res.clearCookie("adminToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    res.json({
      success: true,
      message: "Admin logged out successfully",
    });
  } catch (error) {
    console.error("Admin logout error:", error);
    res.status(500).json({ message: "Server error while logging out" });
  }
};