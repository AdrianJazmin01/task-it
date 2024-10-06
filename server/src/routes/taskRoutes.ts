import { Router } from "express";
import {
  createTask,
  getTasks,
  getUserTasks,
  updateTaskStatus,deleteTask ,
} from "../controllers/taskController";

const router = Router();

router.get("/", getTasks);
router.post("/", createTask);
router.patch("/:taskId/status", updateTaskStatus);
router.delete('/tasks/:taskId', deleteTask);
router.get("/user/:userId", getUserTasks);

export default router;
