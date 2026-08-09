import express from "express";
import {
  createTask,
  getAllTasks,
  getTasksByStaff,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
  reorderTasks,
} from "../Controllers/TaskController.js";

const router = express.Router();

// CREATE
router.post("/", createTask);

// READ
router.get("/", getAllTasks);
router.get("/:id", getTaskById);
router.get("/staff/:staffId", getTasksByStaff);

// UPDATE
router.put("/:id", updateTask);
router.patch("/:id/status", updateTaskStatus);
router.patch("/reorder", reorderTasks);

// DELETE
router.delete("/:id", deleteTask);

export default router;