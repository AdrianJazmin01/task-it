import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all projects
export const getProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const projects = await prisma.project.findMany();
    res.json(projects);
  } catch (error: any) {
    res.status(500).json({ message: `Error retrieving projects: ${error.message}` });
  }
};

// Create a new project
export const createProject = async (req: Request, res: Response): Promise<void> => {
  const { name, description, startDate, endDate } = req.body;
  try {
    const newProject = await prisma.project.create({
      data: {
        name,
        description,
        startDate,
        endDate,
      },
    });
    res.status(201).json(newProject);
  } catch (error: any) {
    res.status(500).json({ message: `Error creating a project: ${error.message}` });
  }
};

// Delete a project by ID
// Delete a project by ID
export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    // Step 1: Delete comments related to tasks in the project
    await prisma.comment.deleteMany({
      where: {
        task: {
          projectId: Number(id),
        },
      },
    });

    // Step 2: Delete attachments related to tasks in the project
    await prisma.attachment.deleteMany({
      where: {
        task: {
          projectId: Number(id),
        },
      },
    });

    // Step 3: Delete tasks associated with the project
    await prisma.task.deleteMany({
      where: { projectId: Number(id) },
    });

    // Step 4: Delete the project itself
    const project = await prisma.project.delete({
      where: { id: Number(id) }, // Ensure you're using the correct ID type
    });

    res.status(200).json({ message: `Project with ID ${id} deleted successfully.`, project });
  } catch (error: any) {
    if (error.code === 'P2025') {
      // Handle case where the project is not found
      res.status(404).json({ message: `Project with ID ${id} not found.` });
    } else {
      res.status(500).json({ message: `Error deleting project: ${error.message}` });
    }
  }
};

