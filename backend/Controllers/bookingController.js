import Booking from "../Models/Booking.js";
import Listing from "../Models/Listing.js";
import User from "../Models/User.js";
import { sendEmail } from "../utils/sendEmail.js";

// ============================
// 🟢 CREATE BOOKING (FAST ⚡)
// ============================
export const createBooking = async (req, res) => {
  try {
    const {
      listingId,
      viewingDate,
      viewingSlot,
      message,
      userId,
      guestName,
      guestEmail,
      guestPhone,
    } = req.body;

    console.log("📩 Incoming Booking Request:", req.body);

    // ============================
    // ✅ BASIC VALIDATION
    // ============================
    if (!listingId || !viewingDate || !viewingSlot) {
      return res.status(400).json({
        message: "Listing, date and time slot are required",
      });
    }

    // ============================
    // 🔹 FETCH LISTING
    // ============================
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    let user = null;

    // ============================
    // 👤 LOGGED-IN USER FLOW
    // ============================
    if (userId) {
      user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
    }

    // ============================
    // 🧍 GUEST FLOW VALIDATION
    // ============================
    if (!userId) {
      if (!guestName || !guestEmail || !guestPhone) {
        return res.status(400).json({
          message: "Name, email and phone are required",
        });
      }
    }

    // ============================
    // ❌ PREVENT PAST DATE
    // ============================
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(viewingDate);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return res.status(400).json({
        message: "Cannot book past dates",
      });
    }

    // ============================
    // 🔹 CREATE BOOKING
    // ============================
    const booking = await Booking.create({
      user: userId || null,
      guestName: user ? null : guestName,
      guestEmail: user ? null : guestEmail,
      guestPhone: user ? null : guestPhone,
      listing: listingId,
      viewingDate,
      viewingSlot,
      message,
    });

    console.log("✅ Booking Created:", booking);

    const fullAddress = `
      ${listing.location?.address || ""}
      ${listing.location?.city || ""}
      ${listing.location?.postcode || ""}
    `;

    // ============================
    // ⚡ FAST RESPONSE FIRST
    // ============================
    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });

    // ============================
    // 📧 COMMON EMAIL DATA
    // ============================
    const userEmail = user?.email || guestEmail;
    const userName =
      user?.firstName || guestName || "User";
    const userPhone =
      user?.phone || guestPhone || "-";

    // ============================
    // 📧 EMAIL TEMPLATES
    // ============================
    const userHtml = `
    <div style="font-family:Arial;background:#f5f5f5;padding:40px">
      <div style="max-width:700px;margin:auto;background:white;border-radius:12px;overflow:hidden">

        <div style="background:#F47C3C;padding:20px;text-align:center;color:white">
          <h1>Viewing Request Received</h1>
        </div>

        <div style="padding:30px">

          <p>Hello ${userName},</p>

          <p>Your viewing request is currently <strong style="color:#F47C3C;">Pending</strong>.</p>

          <hr/>

          <h3 style="color:#F47C3C">📍 Property Details</h3>
          <p><strong>${listing.title}</strong></p>
          <p>${fullAddress}</p>
          <p><strong>Room Type:</strong> ${listing.roomType}</p>
          <p><strong>Price:</strong> £${listing.monthlyPrice}/month</p>

          <hr/>

          <h3 style="color:#F47C3C">📅 Viewing</h3>
          <p><strong>Date:</strong> ${new Date(viewingDate).toDateString()}</p>
          <p><strong>Slot:</strong> ${viewingSlot}</p>

          ${message ? `<p><strong>Message:</strong> ${message}</p>` : ""}

          <hr/>

          <p>We will contact you shortly to confirm your viewing.</p>

          <p style="margin-top:30px">
            Regards,<br/>
            <strong>LONDONROOMSRENT</strong>
          </p>

        </div>
      </div>
    </div>
    `;

    const adminHtml = `
    <div style="font-family:Arial;background:#f5f5f5;padding:40px">
      <div style="max-width:700px;margin:auto;background:white;border-radius:12px;overflow:hidden">

        <div style="background:#0a192f;padding:20px;text-align:center;color:white">
          <h1>New Viewing Request</h1>
        </div>

        <div style="padding:30px">

          <h3 style="color:#F47C3C">👤 User Info</h3>
          <p><strong>Name:</strong> ${userName}</p>
          <p><strong>Email:</strong> ${userEmail}</p>
          <p><strong>Phone:</strong> ${userPhone}</p>

          <hr/>

          <h3 style="color:#F47C3C">🏠 Property</h3>
          <p><strong>${listing.title}</strong></p>
          <p>${fullAddress}</p>

          <hr/>

          <h3 style="color:#F47C3C">📅 Viewing</h3>
          <p><strong>Date:</strong> ${new Date(viewingDate).toDateString()}</p>
          <p><strong>Slot:</strong> ${viewingSlot}</p>

          <hr/>

          <h3 style="color:#F47C3C">💬 Message</h3>
          <p>${message || "No message provided"}</p>

        </div>
      </div>
    </div>
    `;

    // ============================
    // ⚡ BACKGROUND EMAILS
    // ============================
    setImmediate(() => {
      try {
        if (userEmail) {
          sendEmail(
            userEmail,
            "📅 Viewing Request Received - LONDONROOMSRENT",
            userHtml
          ).catch((err) =>
            console.error("❌ User email failed:", err.message)
          );
        }

        sendEmail(
          "londonroomsrent2@gmail.com",
          "📢 New Viewing Request",
          adminHtml
        ).catch((err) =>
          console.error("❌ Admin email failed:", err.message)
        );
      } catch (err) {
        console.error("🔥 Background email error:", err);
      }
    });

  } catch (error) {
    console.error("🔥 Error in createBooking:", error);
    res.status(500).json({ message: error.message });
  }
};

// ============================
// 🟢 GET ALL BOOKINGS (ADMIN)
// ============================
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "firstName surname email phone")
      .populate("listing")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============================
// 🟢 GET BOOKINGS BY USER
// ============================
export const getMyBookings = async (req, res) => {
  try {
    const { userId } = req.params;

    const bookings = await Booking.find({ user: userId })
      .populate("listing")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============================
// 🟢 UPDATE BOOKING (FAST ⚡)
// ============================
export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, confirmedDate, confirmedTime } = req.body;

    const booking = await Booking.findById(id)
      .populate("user")
      .populate("listing");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (status) booking.status = status;
    if (confirmedDate) booking.confirmedDate = confirmedDate;
    if (confirmedTime) booking.confirmedTime = confirmedTime;

    await booking.save();

    res.json(booking);

    const user = booking.user;
    const listing = booking.listing;

    // ⚡ BACKGROUND EMAILS
    setImmediate(() => {
      if (!user?.email) return;

      let html = "";
      let subject = "";

      if (status === "Confirmed") {
        subject = "✅ Viewing Confirmed";
        html = `
          <h2>Your Viewing is Confirmed 🎉</h2>
          <p>Hi ${user.firstName}</p>
          <p><b>${listing.title}</b></p>
          <p>Date: ${new Date(confirmedDate).toDateString()}</p>
          <p>Time: ${confirmedTime}</p>
        `;
      }

      if (status === "Cancelled") {
        subject = "❌ Viewing Cancelled";
        html = `<p>Your viewing has been cancelled</p>`;
      }

      if (status === "Completed") {
        subject = "✅ Viewing Completed";
        html = `<p>Thanks for attending</p>`;
      }

      if (subject) {
        sendEmail(user.email, subject, html).catch(err =>
          console.error("Email fail:", err.message)
        );
      }
    });

  } catch (error) {
    console.error("🔥 Error in updateBooking:", error);
    res.status(500).json({ message: error.message });
  }
};