import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import mongoose from "mongoose";
import taskRoutes from "./routes/taskRoutes";
import { redisClient } from "./utils/redisClient";
import Task from "./models/taskModel";

// Load environment variables

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

app.use(express.json());

// Socket.io setup
io.on("connection", (socket) => {
  console.log("New WebSocket connection");

  socket.on("add", async (task) => {
    const key = "FULLSTACK_TASK_RUBY"; // Replace with your first name

    try {
      const keyType = await redisClient.type(key);

      if (keyType === "list") {
        await redisClient.lPush(key, JSON.stringify(task));

        const length = await redisClient.lLen(key);

        if (length > 50) {
          const tasks = await redisClient.lRange(key, 0, -1);

          await Task.insertMany(tasks.map((task) => JSON.parse(task)));
          await redisClient.del(key);
        }
      } else {
        console.error(`Expected list but found ${keyType}`);
        // Optionally, handle this case (e.g., delete the key or reset it)
        await redisClient.del(key);
        await redisClient.lPush(key, JSON.stringify(task));
      }
    } catch (err) {
      console.error("Redis Error:", err);
    }
  });
});

// Root route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Fetch all tasks
app.get("/fetchAllTasks", async (req, res) => {
  const key = "FULLSTACK_TASK_RUBY"; // Replace with your first name
  try {
    const keyType = await redisClient.type(key);
    let tasks;

    if (keyType === "list") {
      tasks = await redisClient.lRange(key, 0, -1);
    } else {
      // If the key is not a list, fetch from MongoDB
      tasks = await Task.find({});
      tasks = tasks.map((task) => JSON.stringify(task));
    }

    res.json(tasks.map((task) => JSON.parse(task)));
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Unknown error occurred" });
    }
  }
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await redisClient.quit();
  process.exit(0);
});

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
