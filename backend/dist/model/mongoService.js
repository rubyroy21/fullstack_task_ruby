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
exports.saveTasksToMongoDB = void 0;
require("dotenv").config();
const mongoose = require("mongoose");
const mongoURL = process.env.MONGODB_URI;
const collectionName = process.env.COLLECTION_NAME;
mongoose
    .connect(mongoURL)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));
const taskSchema = new mongoose.Schema({
    task: String,
});
const Task = mongoose.model(collectionName, taskSchema);
const saveTasksToMongoDB = (tasks) => __awaiter(void 0, void 0, void 0, function* () {
    yield Task.insertMany(tasks.map((task) => ({ task })));
});
exports.saveTasksToMongoDB = saveTasksToMongoDB;
