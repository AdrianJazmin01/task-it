import { Router } from "express";
import { createProject, getProjects, deleteProject } from "../controllers/projectController";

const router = Router();

router.get("/", getProjects);
router.post("/", createProject);

// Add the DELETE route
router.delete("/:id", deleteProject);

export default router;


