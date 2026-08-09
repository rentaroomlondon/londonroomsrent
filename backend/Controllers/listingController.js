import Listing from "../Models/Listing.js";
import slugify from "slugify";
import { redis } from "../utils/redis.js";
import { clearListingCache } from "../utils/clearCache.js";

// ============================================
// 🔥 CLEAN SEO SLUG
// ============================================
const cleanSlug = (title) => {
  return slugify(title, {
    lower: true,
    strict: true,
    trim: true,
  })
    .replace(/pound\d+/g, "")
    .replace(/for-rent|to-rent/g, "")
    .replace(/and|or/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .split("-")
    .slice(0, 6)
    .join("-");
};

// ============================================
// 🔥 UNIQUE SLUG
// ============================================
const generateUniqueSlug = async (title) => {
  let baseSlug = cleanSlug(title);

  if (!baseSlug) baseSlug = "listing";

  let slug = baseSlug;
  let counter = 1;

  while (await Listing.findOne({ slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};

// ============================================
// 🔥 GENERATE LISTING ID
// ============================================
const generateListingId = () => {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `LONDONROOMSRENT-${random}`;
};

// ============================================
// ✅ CREATE LISTING
// ============================================
export const createListing = async (req, res) => {
  try {
    const data = req.body;

    data.slug = await generateUniqueSlug(data.title);
    data.listingId = generateListingId();

    const listing = await Listing.create(data);

    await clearListingCache();

    res.status(201).json({
      success: true,
      listing,
    });
  } catch (error) {
    console.error("CREATE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateListing = async (req, res) => {
  try {
    const { slug } = req.params;

    let listing = await Listing.findOne({ slug });

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    // ❌ REMOVE THIS BLOCK (IMPORTANT)
    // if (req.body.title && req.body.title !== listing.title) {
    //   req.body.slug = await generateUniqueSlug(req.body.title);
    // }

    // ✅ NEVER update slug
    delete req.body.slug;

    listing = await Listing.findOneAndUpdate(
      { slug },
      req.body,
      { new: true, runValidators: true }
    );

    await clearListingCache();

    res.json({
      success: true,
      listing,
    });
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================
// ❌ DELETE LISTING
// ============================================
export const deleteListing = async (req, res) => {
  try {
    const { slug } = req.params;

    const listing = await Listing.findOneAndDelete({ slug });

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    await clearListingCache();

    res.json({
      success: true,
      message: "Listing deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================
// 🔍 GET SINGLE LISTING (NO CACHE)
// ============================================
export const getListingBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const listing = await Listing.findOne({ slug });

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    res.json({
      success: true,
      listing,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================
// 📦 GET ALL LISTINGS (CACHED)
// ============================================
export const getAllListings = async (req, res) => {
  try {
    const listings = await Listing.find()
      .sort({ createdAt: -1 })
      .lean();

    const total = listings.length;

    return res.json({
      success: true,
      total,
      listings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================
// 🔍 SEARCH (NO CACHE - OPTIONAL)
// ============================================
export const searchListings = async (req, res) => {
  try {
    const {
      search,
      minPrice,
      maxPrice,
      roomType,
      occupancy,
      furnished,
      lat,
      lng,
      radius = 25,
      date,
    } = req.query;

    let query = {};
    let andConditions = [];

    const extractPostcode = (text) => {
      if (!text) return null;

      const clean = text.toUpperCase().trim();

      const full = clean.match(/[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}/);
      if (full) return full[0].replace(/\s+/g, "");

      const prefix = clean.match(/^[A-Z]{1,2}\d{1,2}[A-Z]?/);
      if (prefix) return prefix[0];

      return null;
    };

    const normalizePostcode = (postcode) =>
      postcode.replace(/\s+/g, "").toUpperCase();

    // ===============================
    // ✅ SEARCH
    // ===============================
    let isPostcodeSearch = false;

    if (search && search.trim() !== "") {
      const clean = search.trim();
      const extractedPostcode = extractPostcode(clean);

      if (extractedPostcode) {
        isPostcodeSearch = true;

        if (extractedPostcode.length > 4) {
          // FULL postcode (normalized match)
          andConditions.push({
            $expr: {
              $eq: [
                {
                  $replaceAll: {
                    input: "$location.postcode",
                    find: " ",
                    replacement: "",
                  },
                },
                extractedPostcode,
              ],
            },
          });
        } else {
          // PREFIX search (NW2)
          andConditions.push({
            "location.postcode": {
              $regex: "^" + extractedPostcode,
              $options: "i",
            },
          });
        }
      } else {

        const cityAliases = {
          "greater london": "London",
          "greater manchester": "Manchester",
          "west midlands": "Birmingham",
          "west yorkshire": "Leeds",
          "merseyside": "Liverpool",
          "south yorkshire": "Sheffield",
        };
        // TEXT SEARCH
        const normalizedSearch =
          cityAliases[clean.toLowerCase()] || clean;

        const searchRegex = new RegExp(normalizedSearch, "i");

        andConditions.push({
          $or: [
            { title: searchRegex },
            { "location.address": searchRegex },
            { "location.city": searchRegex },
            { "location.postcode": searchRegex },
          ],
        });
      }
    }

    // ===============================
    // ✅ GEO (ONLY if NOT postcode)
    // ===============================
    if (
      lat &&
      lng &&
      !isNaN(lat) &&
      !isNaN(lng) &&
      isPostcodeSearch
    ) {
      andConditions.push({
        location: {
          $geoWithin: {
            $centerSphere: [
              [Number(lng), Number(lat)],
              Number(radius) / 6378.1,
            ],
          },
        },
      });
    }

    // ===============================
    // ✅ OTHER FILTERS
    // ===============================
    if (minPrice || maxPrice) {
      let priceQuery = {};

      if (minPrice && !isNaN(minPrice)) {
        priceQuery.$gte = Number(minPrice);
      }

      if (maxPrice && !isNaN(maxPrice)) {
        priceQuery.$lte = Number(maxPrice);
      }

      andConditions.push({ monthlyPrice: priceQuery });
    }

    if (roomType) {
      andConditions.push({ roomType });
    }

    if (occupancy) {
      andConditions.push({ occupancy });
    }

    if (furnished !== undefined) {
      andConditions.push({
        furnished: furnished === "true",
      });
    }

    if (date) {
      andConditions.push({
        availableFrom: { $lte: new Date(date) },
      });
    }

    if (andConditions.length > 0) {
      query.$and = andConditions;
    }

    const listings = await Listing.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      count: listings.length,
      listings,
    });
  } catch (error) {
    console.error("Search Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ============================================
// ⭐ FEATURED LISTINGS (CACHED)
// ============================================
export const getFeaturedListings = async (req, res) => {
  try {
    const cacheKey = "listings:featured";

    const cached = await redis.get(cacheKey);

    if (cached) {
      const listings =
        typeof cached === "string" ? JSON.parse(cached) : cached;

      console.log("⚡ GET FROM CACHE:", cacheKey);

      return res.json({
        success: true,
        source: "cache",
        listings,
      });
    }

    const listings = await Listing.find({ featured: true })
      .select("_id slug title images description location monthlyPrice availableImmediately availableFrom listingId")
      .sort({ createdAt: -1 })
      .lean();

    // ✅ Upstash native JSON (no stringify needed)
    await redis.set(cacheKey, listings, {
      ex: 60 * 60,
    });

    console.log("💾 STORED IN CACHE:", cacheKey);

    return res.json({
      success: true,
      source: "db",
      listings,
    });

  } catch (error) {
    console.error("❌ ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ============================================
// 🌍 META (CACHED)
// ============================================
export const getListingMeta = async (req, res) => {
  try {
    const cacheKey = "listings:meta";

    // 🔹 Check cache
    let cached = await redis.get(cacheKey);

    if (cached) {
      let listings;

      try {
        // ✅ Handle both string + object cases (fix your error)
        listings =
          typeof cached === "string" ? JSON.parse(cached) : cached;
      } catch (err) {
        console.error("Cache parse error:", err);
        listings = [];
      }

      return res.status(200).json({
        success: true,
        source: "cache",
        listings,
      });
    }

    // 🔹 Fetch from DB
    const listings = await Listing.find()
      .select("title description slug createdAt updatedAt")
      .sort({ createdAt: -1 })
      .lean(); // ✅ better performance

    // 🔹 Store in Redis (stringify ONLY here)
    await redis.set(cacheKey, JSON.stringify(listings), "EX", 60 * 10); 
    // expires in 10 minutes (optional but recommended)

    return res.status(200).json({
      success: true,
      source: "db",
      listings,
    });

  } catch (error) {
    console.error("getListingMeta error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

export const getNearbyListings = async (req, res) => {
  try {
    const { lng, lat, currentId } = req.query;

    if (!lng || !lat) {
      return res.status(400).json({ message: "Longitude and Latitude are required." });
    }

    const nearbyRooms = await Listing.find({
      // 1. Exclude the current listing the user is viewing
      _id: { $ne: currentId },
      // 2. Ensure we only show available rooms
      status: "available",
      // 3. Geo-spatial query
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)], // [longitude, latitude]
          },
          $maxDistance: 5000, // Distance in meters (5km radius)
        },
      },
    })
    .select("title monthlyPrice roomType bathroomType location images availableImmediately availableFrom");

    res.status(200).json(nearbyRooms);
  } catch (error) {
    res.status(500).json({ message: "Error fetching nearby rooms", error: error.message });
  }
};