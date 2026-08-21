import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../Models/User.js";
import { sendEmail } from "../utils/sendEmail.js";
import { validate } from "deep-email-validator";
import { isNameSafe } from "../utils/validateName.js"; // ← NameAPI helper

// helper to create JWT cookie
const sendTokenCookie = (user, res, rememberMe) => {

  const expiresIn = rememberMe ? "30d" : "1d";

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn }
  );

  const maxAge = rememberMe
    ? 30 * 24 * 60 * 60 * 1000
    : 24 * 60 * 60 * 1000;

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge
  });

  return token;
};


// ---------- Helpers name and email ----------
const isValidName = (name) => {
  if (!name || typeof name !== "string") return false;

  const cleaned = name.trim();

  // 1. Basic format
  if (!/^[a-zA-Z\s'-]{2,40}$/.test(cleaned)) return false;

  // 2. Must contain at least one vowel
  if (!/[aeiouAEIOU]/.test(cleaned)) return false;

  // 3. Reject too many consecutive consonants
  if (/[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]{5,}/.test(cleaned)) {
    return false;
  }

  // 4. Reject very short names
  if (cleaned.length < 3) return false;

  // 5. Reject common fake / keyboard patterns
  const lower = cleaned.toLowerCase();
  if (
    /^(test|temp|fake|asdf|qwerty|xxx|spam|abc|admin|name|fullname|lastname|firstname)/.test(lower) ||
    /^[bcdfghjklmnpqrstvwxyz]{4,}$/.test(lower)
  ) {
    return false;
  }

  return true;
};

const isSpammyEmail = (email) => {
  if (!email) return true;
  const local = (email.split("@")[0] || "").toLowerCase();

  const dotCount = (local.match(/\./g) || []).length;
    if (dotCount >= 3) return true;
    if (local.includes("..") || local.startsWith(".") || local.endsWith(".")) return true;
    if (local.length < 3) return true;

    // 🔥 NEW: Block short emails with dots (e.g. h.e.n, a.b.c, x.y)
    if (dotCount >= 2 && local.length <= 6) return true;
    if (dotCount >= 1 && local.replace(/\./g, "").length <= 3) return true;

    // Existing rules
    if (!/[aeiou]/.test(local)) return true;
    if (/[bcdfghjklmnpqrstvwxyz]{5,}/.test(local)) return true;
    if (/^(test|temp|fake|asdf|qwerty|xxx|spam|abc|123|admin)/.test(local)) return true;
    if (/^\d+$/.test(local)) return true;
    if (/^[a-z]{1,2}\d+$/.test(local)) return true;
    if (local.length >= 8 && !/[aeiou].*[aeiou]/.test(local)) return true;

    return false;
  };

// ================= REGISTER =================
export const register = async (req, res) => {
  try {

    const {
      title,
      firstName,
      surname,
      email,
      phone,
      password,
      budgetFrom,
      budgetTo,
      occupants,
      roomType,
      needFromDate,
      notes,
      isVerified,
      website, // honeypot
    } = req.body;

    // ============================
    // 🛡️ HONEYPOT CHECK
    // ============================
    if (website) {
      return res.status(201).json({
        success: true,
        message: "Registration successful. Please verify your email.",
      });
    }

    // ============================
    // ✅ BASIC REQUIRED FIELDS
    // ============================
    if (!firstName || !surname || !email || !password) {
      return res.status(400).json({
        message: "First name, surname, email and password are required",
      });
    }

    // ============================
    // 🔍 NAME VALIDATION (firstName + surname)
    // ============================
    if (!isValidName(firstName)) {
      return res.status(400).json({
        message: "Invalid first name. Please provide a real name.",
      });
    }

    if (!isValidName(surname)) {
      return res.status(400).json({
        message: "Invalid surname. Please provide a real name.",
      });
    }

    // NameAPI check
    const firstNameSafe = await isNameSafe(firstName);
    if (!firstNameSafe) {
      return res.status(400).json({
        message: "Invalid first name. Please provide a real name.",
      });
    }

    const surnameSafe = await isNameSafe(surname);
    if (!surnameSafe) {
      return res.status(400).json({
        message: "Invalid surname. Please provide a real name.",
      });
    }

    // ============================
    // 🔍 EMAIL VALIDATION
    // ============================
    const emailLower = email.toLowerCase().trim();

    if (isSpammyEmail(emailLower)) {
      return res.status(400).json({
        message: "Invalid email address",
      });
    }

    const emailValidation = await validate({
      email: emailLower,
      validateRegex: true,
      validateMx: true,
      validateTypo: true,
      validateDisposable: true,
      validateSMTP: false,
    });

    if (!emailValidation.valid) {
      console.log("❌ Email validation failed:", emailValidation.reason);
      return res.status(400).json({
        message: "Invalid or disposable email address",
      });
    }

    // ============================
    // 🔍 CHECK IF EMAIL ALREADY EXISTS
    // ============================
    const existingUser = await User.findOne({ email: emailLower });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    // ============================
    // 🔹 CREATE USER
    // ============================
    const verifyToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      title,
      firstName: firstName.trim(),
      surname: surname.trim(),
      email: emailLower,
      phone,
      password,
      budgetFrom,
      budgetTo,
      occupants,
      roomType,
      needFromDate,
      notes,
      isVerified: isVerified || false,
      emailVerifyToken: verifyToken,
    });

    const verifyUrl = `${process.env.SERVER_URL}/api/auth/verify-email/${verifyToken}`;

    // ============================
    // 📧 EMAIL TEMPLATE
    // ============================
    const html = `
    <div style="font-family:Arial;background:#f5f5f5;padding:10px">
      <div style="max-width:800px;margin:auto;background:white;border-radius:10px;overflow:hidden">

        <div style="background:#F47C3C;padding:25px;text-align:center;color:white">
          <h1>Welcome 🎉</h1>
        </div>

        <div style="padding:30px;color:#333">

          <h2>Hello ${firstName},</h2>

          <p>
            Thank you for joining us! Your account has been created successfully.
          </p>

          <p>
            Please verify your email address to activate your account.
          </p>

          <div style="text-align:center;margin:35px 0">
            <a href="${verifyUrl}"
            style="
            background:#F47C3C;
            color:white;
            padding:14px 30px;
            border-radius:6px;
            text-decoration:none;
            font-weight:bold;
            ">
            Verify Email
            </a>
          </div>

          <p>If you did not create this account, please ignore this email.</p>

          <p style="margin-top:30px">
          Regards,<br/>
          <strong>Team</strong>
          </p>

        </div>

        <div style="background:#fafafa;padding:15px;text-align:center;font-size:13px;color:#888">
          © ${new Date().getFullYear()} All rights reserved
        </div>

      </div>
    </div>
    `;

    // 🔥 Send email in background (don't block response)
    sendEmail(emailLower, "Welcome! Verify your email", html)
      .then(() => console.log("✅ Verification email sent to:", emailLower))
      .catch((err) => console.error("❌ Email error:", err.message));

    // Fast response
    res.status(201).json({
      success: true,
      message: "Registration successful. Please verify your email.",
    });
  } catch (error) {
    console.error("🔥 Register error:", error);
    res.status(500).json({ message: error.message });
  }
};


// ================= VERIFY EMAIL =================
export const verifyEmail = async (req, res) => {
  try {

    const user = await User.findOne({
      emailVerifyToken: req.params.token
    });

    if (!user) {
      return res.redirect(`${process.env.CLIENT_URL}/login?error=invalid_token`);
    }

    user.isVerified = true;
    user.emailVerifyToken = undefined;

    await user.save();

    return res.redirect(`${process.env.CLIENT_URL}/login?verified=true`);

  } catch (error) {

    return res.redirect(`${process.env.CLIENT_URL}/login?error=server_error`);

  }
};


// ================= LOGIN =================
export const login = async (req, res) => {

  try {

    const { email, password, rememberMe } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        message: "Please verify your email first"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    const token = sendTokenCookie(user, res, rememberMe);

    user.password = undefined;

    res.json({
      success: true,
      user
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};



// ================= FORGOT PASSWORD =================
export const forgotPassword = async (req, res) => {

  try {

    const { email } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/forget-password?token=${resetToken}`;

    const html = `
    <div style="font-family:Arial;background:#f5f5f5;padding:40px">

      <div style="max-width:600px;margin:auto;background:white;border-radius:10px">

        <div style="background:#F47C3C;padding:25px;text-align:center;color:white">
          <h1>Password Reset</h1>
        </div>

        <div style="padding:30px">

          <p>Hello ${user.firstName},</p>

          <p>You requested a password reset.</p>

          <div style="text-align:center;margin:30px">

            <a href="${resetUrl}"
            style="
            background:#F47C3C;
            color:white;
            padding:14px 28px;
            text-decoration:none;
            border-radius:6px;
            font-weight:bold
            ">
            Reset Password
            </a>

          </div>

          <p>If you didn't request this, ignore this email.</p>

        </div>

      </div>

    </div>
    `;

    await sendEmail(email, "Reset your password", html);

    res.json({
      success: true,
      message: "Password reset email sent"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};



// ================= RESET PASSWORD =================
export const resetPassword = async (req, res) => {

  try {

    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token"
      });
    }

    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({
      success: true,
      message: "Password reset successful"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};


// ================= GET CURRENT USER =================
export const getCurrentUser = async (req, res) => {
  try {
    const token = req.cookies.token; // Read JWT from httpOnly cookie

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password"); // exclude password

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};


// ================= LOGOUT =================
export const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error while logging out" });
  }
};