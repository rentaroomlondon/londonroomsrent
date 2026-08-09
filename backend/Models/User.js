import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      enum: ["Mr", "Mrs", "Ms"],
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    surname: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    budgetFrom: {
      type: Number,
      default: null,
    },

    budgetTo: {
      type: Number,
      default: null,
    },

    occupants: {
      type: Number,
      default: 1,
    },

    roomType: {
      type: String,
      enum: ["Any", "Studio", "1 Bedroom", "Single Room", "Double Room", "Ensuit Room"],
      default: "Any",
    },

    needFromDate: {
      type: Date,
    },

    notes: {
      type: String,
      trim: true,
    },

    // 👤 Profile Image
    profileImage: {
      type: String,
      default: "",
    },

    // 📍 Full Address Object
    address: {
      flatNumber: {
        type: String,
        trim: true,
      },
      buildingName: {
        type: String,
        trim: true,
      },
      houseNumber: {
        type: String,
        trim: true,
      },
      street: {
        type: String,
        trim: true,
      },
      town: {
        type: String,
        trim: true,
      },
      area: {
        type: String,
        trim: true,
      },
      county: {
        type: String,
        trim: true,
      },
      postcode: {
        type: String,
        trim: true,
      },
      country: {
        type: String,
        trim: true,
      },
    },

    homeNumber: {
      type: String,
      trim: true,
    },

    workNumber: {
      type: String,
      trim: true,
    },

    // 🏠 Property Requirements
    propertyType: {
      type: String,
      enum: ["Flat", "House", "Studio", "House Share"],
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
    emailVerifyToken: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    documents: {
      idDocument: {
        fileUrl: { type: String, default: "" },
        status: {
          type: String,
          enum: ["not_uploaded", "pending", "approved", "rejected"],
          default: "not_uploaded",
          index: true
        },
      },
      jobReference: {
        fileUrl: { type: String, default: "" },
        status: {
          type: String,
          enum: ["not_uploaded", "pending", "approved", "rejected"],
          default: "not_uploaded",
          index: true
        },
      },
      bankStatement: {
        fileUrl: { type: String, default: "" },
        status: {
          type: String,
          enum: ["not_uploaded", "pending", "approved", "rejected"],
          default: "not_uploaded",
          index: true
        },
      },
      nextOfKin: {
        fileUrl: { type: String, default: "" },
        status: {
          type: String,
          enum: ["not_uploaded", "pending", "approved", "rejected"],
          default: "not_uploaded",
          index: true
        },
      },
      landlordReference: {
        fileUrl: { type: String, default: "" },
        status: {
          type: String,
          enum: ["not_uploaded", "pending", "approved", "rejected"],
          default: "not_uploaded",
          index: true
        },
      },
      niNumber: {
        fileUrl: { type: String, default: "" },
        status: {
          type: String,
          enum: ["not_uploaded", "pending", "approved", "rejected"],
          default: "not_uploaded",
          index: true
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

// 🔐 hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default mongoose.models.User || mongoose.model("User", userSchema);