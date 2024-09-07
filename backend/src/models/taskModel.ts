import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    task: String,
  },
  { collection: process.env.MONGODB_COLLECTION }
);

export default mongoose.model("Task", taskSchema);
