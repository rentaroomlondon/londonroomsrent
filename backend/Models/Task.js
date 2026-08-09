import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    // 🧑 Assigned staff
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      default: null,
    },

    // 📌 Board column (Trello style)
    status: {
      type: String,
      enum: ["todo", "inprogress", "done"],
      default: "todo",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    dueDate: Date,

    attachments: [String], // images/files

    // 🔥 ordering inside column (important for drag UI)
    order: {
      type: Number,
      default: 0,
    },

    lastReminderSent: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);