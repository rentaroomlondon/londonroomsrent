import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    staff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    checkIn: {
      time: Date,
      image: String,
      location: {
        lat: Number,
        lng: Number,
      },
    },

    checkOut: {
      time: Date,
      image: String,
      location: {
        lat: Number,
        lng: Number,
        address: String,
      },
    },

    totalMinutes: {
      type: Number,
      default: 0,
    },

    isLate: {
      type: Boolean,
      default: false,
    },

    earlyCheckout: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// ✅ FIXED EXPORT
export default mongoose.models.Attendance ||
  mongoose.model("Attendance", attendanceSchema);