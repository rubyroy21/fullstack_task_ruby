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
require("dotenv").config();
const taskRoutes = require("./routes/taskRoutes");
const { redisClient } = require("./utils/redisClient");
const Task = require("./models/taskModel");
const socketIo = require("socket.io");
const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const server = http.createServer(app);
const io = new socketIo(server);
app.use(express.json());
// Set up routes
app.use("/", taskRoutes);
io.on("connection", (socket) => {
    console.log("New WebSocket connection");
    socket.on("add", (task) => __awaiter(void 0, void 0, void 0, function* () {
        const key = "FULLSTACK_TASK_RUBY"; // Replace with your first name
        try {
            const keyType = yield redisClient.type(key);
            if (keyType === "list") {
                yield redisClient.lPush(key, JSON.stringify(task));
                const length = yield redisClient.lLen(key);
                if (length > 50) {
                    const tasks = yield redisClient.lRange(key, 0, -1);
                    yield Task.insertMany(tasks.map((task) => JSON.parse(task)));
                    yield redisClient.del(key);
                }
            }
            else {
                console.error(`Expected list but found ${keyType}`);
                yield redisClient.del(key);
                yield redisClient.lPush(key, JSON.stringify(task));
            }
        }
        catch (err) {
            console.error("Redis Error:", err);
        }
    }));
});
// Gracefully handle shutdown
process.on("SIGINT", () => __awaiter(void 0, void 0, void 0, function* () {
    yield redisClient.quit();
    mongoose.connection.close();
    process.exit(0);
}));
server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
