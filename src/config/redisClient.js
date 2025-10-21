const redis = require("redis");
require("dotenv").config();

// Create redis client with URL from env
const client = redis.createClient({
  url: process.env.REDIS_URL,
});

// Log connection events
client.on("connect", () => console.log("✅ Redis connected successfully"));
client.on("error", (err) => console.error("❌ Redis Error:", err));
client.on("reconnecting", () => console.log("♻️ Reconnecting to Redis..."));

// Connect to redis
(async () => {
  try {
    await client.connect();
  } catch (error) {
    console.error("Failed to connect Redis:", error);
  }
})();

module.exports = client;
