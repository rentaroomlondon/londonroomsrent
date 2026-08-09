import { Redis } from "@upstash/redis";

let redis = null;

export const connectRedis = async () => {
  try {
    const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!redisUrl || !redisToken) {
      console.warn("⚠️ Redis ENV missing — skipping Redis");
      return;
    }

    redis = new Redis({
      url: redisUrl,
      token: redisToken,
    });

    await redis.set("test:connection", "ok", { ex: 5 });

    console.log("✅ Redis connected");

  } catch (error) {
    console.error("❌ Redis connection failed:", error.message);
  }
};

export { redis };