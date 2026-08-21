import nodemailer from "nodemailer";

// ✅ CREATE ONCE (GLOBAL)
const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  // ✅ Pooling
  pool: true,
  maxConnections: 3,
  maxMessages: 50,

  // ✅ Rate limiting (VERY IMPORTANT)
  rateDelta: 1000, // 1 second window
  rateLimit: 2,    // max 2 emails/sec

  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 20000,
  tls: {
    minVersion: "TLSv1.2",
  },
});

// ✅ SEND FUNCTION
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
    console.error("❌ Email error:", error.message);
    throw error;
  }
};