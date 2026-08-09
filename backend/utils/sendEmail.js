import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// ✅ CREATE ONCE (GLOBAL)
const transporter = nodemailer.createTransport({
  service: "gmail",                 // ← easiest way for Gmail
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,   // App Password
  },

  // Optional but recommended
  pool: true,
  maxConnections: 3,
  maxMessages: 50,
  rateDelta: 1000,
  rateLimit: 2,
});

// ✅ SEND FUNCTION (same as before)
export const sendEmail = async (to, subject, html, cc = []) => {
  try {
    return await transporter.sendMail({
      from: `"LONDONROOMSRENT" <${process.env.EMAIL_USER}>`,
      to: Array.isArray(to) ? to.join(",") : to,
      subject,
      html,
      ...(cc.length ? { cc: cc.join(",") } : {}),
    });
  } catch (error) {
    console.error("❌ FULL EMAIL ERROR:");
    console.error({
      message: error.message,
      code: error.code,
      response: error.response,
      responseCode: error.responseCode,
      command: error.command,
    });
    throw error;
  }
};