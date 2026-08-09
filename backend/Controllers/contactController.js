import Contact from "../Models/Contact.js";
import { sendEmail } from "../utils/sendEmail.js";

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
    } = req.body;

    // ✅ Validation
    if (!firstName || !lastName || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // ✅ Save to DB
    const contact = await Contact.create({
      contactMethod,
      title,
      firstName,
      lastName,
      email,
      phone,
      message,
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

    await sendEmail(
      "londonroomsrent2@gmail.com",
      "📩 New Contact Inquiry",
      adminHtml
    );

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

          <p>Thank you for contacting <strong>LONDONROOMSRENT</strong>.</p>
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

    await sendEmail(
      email,
      "We Received Your Message",
      userHtml
    );

    // =========================

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