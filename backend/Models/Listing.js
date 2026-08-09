import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    // 🔹 BASIC INFO
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,

    // 🔹 PROPERTY INFO
    propertyType: {
      type: String,
      enum: ["shared_house", "apartment", "studio", "flat", "house"],
      default: "shared_house",
    },
    
    // Room Type - Updated with new options
    roomType: {
      type: String,
      enum: ["single", "double", "ensuite", "ensuite_double", "studio"],
      required: true,
      default: "single"
    },

    // ✅ SINGLE OCCUPANCY (NEW)
    occupancy: {
      type: String,
      enum: ["single", "double"],
      default: "single",
    },

    furnished: {
      type: Boolean,
      default: true,
    },

    // 🔹 PRICING
    monthlyPrice: Number,
    deposit: Number,
    holdingDeposit: Number,

    // 🔹 AVAILABILITY
    status: {
      type: String,
      enum: ["available", "reserved", "rented"],
      default: "available",
    },
    availableFrom: Date,

    // ✅ AVAILABLE IMMEDIATELY (NEW)
    availableImmediately: {
      type: Boolean,
      default: false,
    },

    minTenancy: {
      type: Number,
      default: 6,
    },

    // 🔹 ROOM DETAILS
    roomSize: String,
    floor: String,

    // ✅ ROOM LABEL (NEW)
    roomLabel: String, // e.g. "Room A"

    // ✅ BATHROOM TYPE (NEW)
    bathroomType: {
      type: String,
      enum: ["private", "shared"],
      default: "shared",
    },

    // ✅ PROPERTY SHARING (NEW)
    propertySharing: {
      type: String,
      enum: ["private", "shared"],
      default: "shared",
    },

    // 🔹 ROOM AMENITIES 🛏️
    roomAmenities: [
      {
        type: String,
        enum: [
          "single_bed",
          "double_bed",
          "ensuite_bathroom",
          "desk",
          "chair",
          "wardrobe",
          "chest_of_drawers",
          "mirror",
          "tv",
          "lockable_room",
          "balcony",
        ],
      },
    ],

    // 🔹 PROPERTY AMENITIES 🏠
    propertyAmenities: [
      {
        type: String,
        enum: [
          "wifi",
          "heating",
          "air_conditioning",
          "washing_machine",
          "dryer",
          "dishwasher",
          "fridge",
          "freezer",
          "microwave",
          "oven",
          "shared_kitchen",
          "cleaning_service",
          "garden",
          "parking",
          "lift",
          "security",
          "cctv",
        ],
      },
    ],

    // 🔹 BILLS INCLUDED
    billsIncluded: {
      electricity: { type: Boolean, default: true },
      gas: { type: Boolean, default: true },
      water: { type: Boolean, default: true },
      wifi: { type: Boolean, default: true },
    },

    // ✅ WIFI SPEED (NEW)
    wifiSpeed: String, // e.g. "400mbps"

    // 🔹 PARKING
    parking: {
      available: {
        type: Boolean,
        default: false,
      },
      type: {
        type: String,
        enum: ["on_street", "off_street", "garage", "permit"],
      },
      details: String,
    },

    // 🔥 LOCATION (GEO SEARCH)
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },

      address: String,
      city: String,
      postcode: String,
    },

    // 🔹 IMAGES
    images: [String],
    // 🔹 PROPERTY DETAILS
    propertyRef: String,
    epcRating: {
      type: String,
      enum: ["A", "B", "C", "D", "E", "F", "G"],
    },
    councilTaxBand: String,

    // 🔹 EXTRA
    slug: {
      type: String,
      unique: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    listingId: {
      type: String,
      unique: true,
    }
  },
  { timestamps: true }
);

// 🔥 GEO INDEX
listingSchema.index({ location: "2dsphere" });

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;