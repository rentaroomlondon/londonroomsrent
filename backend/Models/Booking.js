import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    // 👤 The User requesting the viewing
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // ✅ IMPORTANT
    },

    // 👤 Guest info (if not logged in)
    guestName: {
      type: String,
      trim: true,
    },
    guestEmail: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email"],
    },
    guestPhone: {
      type: String,
      trim: true,
    },
    // 🏠 The Specific Property (Room) being viewed
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing", // Ensure this matches your Room model name exactly
      required: true,
    },
    
    // --- User Request Fields ---
    viewingDate: {
      type: Date,
      required: true,
    },
    viewingSlot: {
      type: String,
      enum: ["Morning", "Afternoon", "Evening"],
      required: true,
    },
    message: {
      type: String,
      trim: true,
      maxlength: 500, // Optional: limit message length
    },

    // --- Admin Confirmation Fields ---
    confirmedDate: { type: Date },
    confirmedTime: { type: String }, // e.g., "11:30 AM"
    
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled", "Completed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Booking || mongoose.model("Booking", bookingSchema);