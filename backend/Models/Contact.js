import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    contactMethod: {
      type: String,
      enum: ["Call me", "Email me"],
      required: true,
    },
    title: {
      type: String,
      enum: ["Mr", "Mrs", "Ms"],
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      trim: true,
    },

    // 🔥 For scaling later
    status: {
      type: String,
      enum: ["new", "contacted", "closed"],
      default: "new",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Contact", contactSchema);