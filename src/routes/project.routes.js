import express from "express";
import {
  addProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/project.controller.js";

const router = express.Router();

router.post("/", addProject);
router.get("/", getProjects);
router.get("/:id", getProjectById);       // 🔥 REQUIRED
router.put("/:id", updateProject);        // 🔥 REQUIRED
router.delete("/:id", deleteProject);

export default router;
