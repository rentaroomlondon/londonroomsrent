import { redis } from "./redis.js";

export const clearListingCache = async () => {
  try {
    const keys = await redis.keys("listings:*");

    if (keys.length > 0) {
      await redis.del(...keys); // ✅ spread operator FIX
      console.log("🧹 Cache cleared:", keys);
    }
  } catch (error) {
    console.error("❌ Cache clear error:", error.message);
  }
};