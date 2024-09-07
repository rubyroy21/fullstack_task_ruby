import { Request, Response } from "express";
import Task from "../models/taskModel";
import { redisClient } from "../utils/redisClient";

export const fetchAllTasks = async (
  req: Request,
  res: Response
): Promise<void> => {
  const key = "FULLSTACK_TASK_RUBY"; // Replace with your first name
  try {
    const keyType = await redisClient.type(key);
    let tasks;

    if (keyType === "list") {
      tasks = await redisClient.lRange(key, 0, -1);
    } else {
      tasks = await Task.find({});
      tasks = tasks.map((task) => JSON.stringify(task));
    }

    res.json(tasks.map((task) => JSON.parse(task)));
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
