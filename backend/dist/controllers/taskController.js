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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAllTasks = void 0;
const taskModel_1 = __importDefault(require("../models/taskModel"));
const redisClient_1 = require("../utils/redisClient");
const fetchAllTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const key = "FULLSTACK_TASK_RUBY"; // Replace with your first name
    try {
        const keyType = yield redisClient_1.redisClient.type(key);
        let tasks;
        if (keyType === "list") {
            tasks = yield redisClient_1.redisClient.lRange(key, 0, -1);
        }
        else {
            tasks = yield taskModel_1.default.find({});
            tasks = tasks.map((task) => JSON.stringify(task));
        }
        res.json(tasks.map((task) => JSON.parse(task)));
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.fetchAllTasks = fetchAllTasks;
