import Contact from "../Models/Contact.js";
import { sendEmail } from "../utils/sendEmail.js";
import { validate } from "deep-email-validator";
import { isNameSafe } from "../utils/validateName.js"; // ← NameAPI helper

// ---------- Helpers ----------
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

  return true;
};

const isValidPhone = (phone) => {
  if (!phone || typeof phone !== "string") return false;
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
};

const isSpammyEmail = (email) => {
  if (!email) return true;
  const local = (email.split("@")[0] || "").toLowerCase();

  const dotCount = (local.match(/\./g) || []).length;
  if (dotCount >= 3) return true;
  if (local.includes("..") || local.startsWith(".") || local.endsWith(".")) return true;
  if (local.length < 3) return true;

  // Random / test patterns
  if (!/[aeiou]/.test(local)) return true;
  if (/[bcdfghjklmnpqrstvwxyz]{5,}/.test(local)) return true;
  if (/^(test|temp|fake|asdf|qwerty|xxx|spam|abc|123|admin)/.test(local)) return true;
  if (/^\d+$/.test(local)) return true;
  if (/^[a-z]{1,2}\d+$/.test(local)) return true;
  if (local.length >= 8 && !/[aeiou].*[aeiou]/.test(local)) return true;

  return false;
};

export const submitContact = async (req, res) => {
  try {
    const {
      contactMethod,
      title,
      firstName,
      lastName,
      email,
      phone,
      message,
      website, // honeypot
    } = req.body;

    // ========== 1. HONEYPOT ==========
    if (website && website.trim() !== "") {
      return res.status(201).json({
        success: true,
        message: "Message sent successfully",
      });
    }

    // ========== 2. BASIC + STRONG VALIDATION ==========
    const errors = [];

    if (!isValidName(firstName)) {
      errors.push("Please enter a valid first name");
    }
    if (!isValidName(lastName)) {
      errors.push("Please enter a valid surname");
    }
    if (!isValidPhone(phone)) {
      errors.push("Please enter a valid phone number (at least 10 digits)");
    }

    const allowedTitles = ["Mr", "Mrs", "Ms"];
    const allowedMethods = ["Call me", "Email me"];

    if (title && !allowedTitles.includes(title)) {
      errors.push("Invalid title selected");
    }
    if (contactMethod && !allowedMethods.includes(contactMethod)) {
      errors.push("Invalid contact method selected");
    }

    if (isSpammyEmail(email?.trim().toLowerCase())) {
      errors.push("Please enter a valid email address");
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: errors[0],
      });
    }

    // ========== 3. NameAPI Risk Detector ==========
    const firstNameSafe = await isNameSafe(firstName);
    if (!firstNameSafe) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid first name",
      });
    }

    const lastNameSafe = await isNameSafe(lastName);
    if (!lastNameSafe) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid surname",
      });
    }

    // Optional: also check full name together
    // const fullNameSafe = await isNameSafe(`${firstName} ${lastName}`);
    // if (!fullNameSafe) { ... }

    // ========== 4. STRONG EMAIL VALIDATION ==========
    const emailResult = await validate({
      email: email?.trim().toLowerCase(),
      validateRegex: true,
      validateMx: true,
      validateTypo: true,
      validateDisposable: true,
      validateSMTP: false,
    });

    if (!emailResult.valid) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    // ========== 5. SAVE TO DB ==========
    const contact = await Contact.create({
      contactMethod: contactMethod || "Call me",
      title: title || "Mr",
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      message: message ? message.trim() : "",
    });

    // =========================
    // 📧 ADMIN EMAIL
    // =========================
    const adminHtml = `
    <div style="font-family:Arial;background:#f5f5f5;padding:40px">
      <div style="max-width:800px;margin:auto;background:white;border-radius:10px;overflow:hidden">

        <div style="background:#FF6B35;padding:10px;text-align:center;color:white">
          <h1>📩 New Contact Inquiry</h1>
        </div>

        <div style="padding:30px">

          <p>Hello Admin,</p>

          <p>You have received a new message from your website.</p>

          <hr/>

          <h3 style="color:#FF6B35">👤 Contact Information</h3>
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Title:</strong> ${title || "-"}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>

          <hr/>

          <h3 style="color:#FF6B35">📞 Preferences</h3>
          <p><strong>Preferred Contact:</strong> ${contactMethod || "-"}</p>

          <hr/>

          <h3 style="color:#FF6B35">💬 Message</h3>
          <p style="background:#f9f9f9;padding:15px;border-radius:6px">
            ${message || "No message provided"}
          </p>

          <hr/>

          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Status:</strong> New Lead</p>

          <hr/>

          <p>⚡ Please respond to this lead as soon as possible.</p>

          <p style="margin-top:30px">
            Regards,<br/>
            <strong>LONDONROOMSRENT System</strong>
          </p>

        </div>
      </div>
    </div>
    `;

    const adminRecipients = [
      "londonroomsrent2@gmail.com",
      "info@londonroomsrent.co.uk",
    ];

    try {
      await sendEmail(adminRecipients, "📩 New Contact Inquiry", adminHtml);
      console.log("✅ ADMIN EMAIL SENT SUCCESSFULLY");
    } catch (error) {
      console.error("❌ ADMIN EMAIL FAILED:", error.message);
    }

    // =========================
    // 📧 USER EMAIL
    // =========================
    const userHtml = `
    <div style="font-family:Arial;background:#f5f5f5;padding:40px">
      <div style="max-width:800px;margin:auto;background:white;border-radius:10px;overflow:hidden">

        <div style="background:#1a2332;padding:10px;text-align:center;color:white">
          <h1>We Received Your Message</h1>
        </div>

        <div style="padding:30px">

          <p>Hello ${firstName},</p>

          <p>Thank you for contacting <strong>LONDONROOMSRENT/strong>.</p>
          <p>We will get back to you shortly.</p>

          <hr/>

          <h3 style="color:#FF6B35">📋 Your Details</h3>
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>

          <hr/>

          <h3 style="color:#FF6B35">💬 Message</h3>
          <p style="background:#f9f9f9;padding:15px;border-radius:6px">
            ${message || "No message provided"}
          </p>

          <hr/>

          <p>We typically respond within 24 hours.</p>

          <p style="margin-top:30px">
            Regards,<br/>
            <strong>LONDONROOMSRENT Team</strong>
          </p>

        </div>
      </div>
    </div>
    `;

    try {
      await sendEmail(email, "We Received Your Message", userHtml);
      console.log(`✅ CUSTOMER CONFIRMATION EMAIL SENT → ${email}`);
    } catch (error) {
      console.error("❌ CUSTOMER EMAIL FAILED:", error.message);
    }

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: contact,
    });
  } catch (error) {
    console.error("Contact Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



// ============================
// 🟢 GET ALL CONTACTS (ADMIN)
// ============================
export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    console.error("Get All Contacts Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};