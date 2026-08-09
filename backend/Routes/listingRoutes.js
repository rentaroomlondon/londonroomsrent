import express from "express";
import {
  createListing,
  updateListing,
  deleteListing,
  getListingBySlug,
  getAllListings,
  searchListings,
  getFeaturedListings,
  getListingMeta,
  getNearbyListings,
} from "../Controllers/listingController.js";

const router = express.Router();

router.post("/", createListing);
router.get("/", getAllListings);
router.get("/meta", getListingMeta);
router.get("/search", searchListings);
router.get("/featured", getFeaturedListings);
router.get("/nearby", getNearbyListings);
router.get("/:slug", getListingBySlug);
router.put("/:slug", updateListing);
router.delete("/:slug", deleteListing);

export default router;