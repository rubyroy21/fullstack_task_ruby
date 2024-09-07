// import { createClient } from "@redis/client";

// // Log environment variables to debug
// console.log(`REDIS_HOST=${process.env.REDIS_HOST}`);
// console.log(`REDIS_PORT=${process.env.REDIS_PORT}`);
// console.log(`REDIS_PASSWORD=${process.env.REDIS_PASSWORD}`);

// // Ensure all required variables are set
// if (!process.env.REDIS_HOST || !process.env.REDIS_PORT) {
//   throw new Error("Redis configuration is missing in environment variables");
// }

// const redisClient = createClient({
//   url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
//   password: process.env.REDIS_PASSWORD,
// });

// redisClient.on("error", (err) => console.error("Redis Client Error", err));

// export { redisClient };

import { createClient } from "@redis/client";

// Ensure proper loading of environment variables
import dotenv from "dotenv";
dotenv.config();

const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  password: process.env.REDIS_PASSWORD,
});

// Error handling
redisClient.on("error", (err) => console.error("Redis Client Error", err));

// Connect to Redis
redisClient.connect().catch(console.error);

export { redisClient };
