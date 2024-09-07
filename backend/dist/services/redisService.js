"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.flushTasksFromRedis = exports.setTasksInRedis = exports.getTasksFromRedis = void 0;
const redis_1 = require("redis");
const redisClient = (0, redis_1.createClient)({
    url: `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});
redisClient.on("error", (err) => console.error("Redis Client Error", err));
redisClient.connect();
const getTasksFromRedis = () => __awaiter(void 0, void 0, void 0, function* () {
    const tasks = yield redisClient.get(`FULLSTACK_TASK_${process.env.FIRST_NAME}`);
    return tasks ? JSON.parse(tasks) : [];
});
exports.getTasksFromRedis = getTasksFromRedis;
const setTasksInRedis = (tasks) => __awaiter(void 0, void 0, void 0, function* () {
    yield redisClient.set(`FULLSTACK_TASK_${process.env.FIRST_NAME}`, JSON.stringify(tasks));
});
exports.setTasksInRedis = setTasksInRedis;
const flushTasksFromRedis = () => __awaiter(void 0, void 0, void 0, function* () {
    yield redisClient.del(`FULLSTACK_TASK_${process.env.FIRST_NAME}`);
});
exports.flushTasksFromRedis = flushTasksFromRedis;
