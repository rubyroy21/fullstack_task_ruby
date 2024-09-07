"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
const redis_1 = require("redis");
const redisClient = (0, redis_1.createClient)({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    password: process.env.REDIS_PASSWORD,
});
exports.redisClient = redisClient;
redisClient.connect().catch(console.error);
redisClient.on("error", (err) => console.error("Redis Client Error", err));
