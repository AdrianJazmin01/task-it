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
export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    // Check if the project exists
    const existingProject = await prisma.project.findUnique({
      where: { id: Number(id) },
    });


    // Step 1: Get all tasks associated with the project
    const tasks = await prisma.task.findMany({
      where: { projectId: Number(id) },
    });

    // Step 2: Delete task assignments related to tasks in the project
    await prisma.taskAssignment.deleteMany({
      where: {
        taskId: {
          in: tasks.map(task => task.id), // Use the IDs of the tasks
        },
      },
    });

    // Step 3: Delete comments related to tasks in the project
    await prisma.comment.deleteMany({
      where: {
        task: {
          projectId: Number(id),
        },
      },
    });

    // Step 4: Delete attachments related to tasks in the project
    await prisma.attachment.deleteMany({
      where: {
        task: {
          projectId: Number(id),
        },
      },
    });

    // Step 5: Delete tasks associated with the project
    await prisma.task.deleteMany({
      where: { projectId: Number(id) },
    });

    // Step 6: Delete the project itself
    const project = await prisma.project.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: `Project with ID ${id} deleted successfully.`, project });
  } catch (error: any) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: `Error deleting project: ${error.message}` });
  }
};



