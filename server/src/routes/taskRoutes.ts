import { Router } from "express";
import { prisma } from "../index";
import { protect } from "../middleware/authMiddleware";
import { Prisma } from "@prisma/client";

const router = Router();

router.post("/", protect, async (req, res) => {
  const { title, description } = req.body;
  const userId = req.userId;

  if (!title || !description) {
    return res
      .status(400)
      .json({ message: "Title and description are required." });
  }

  try {
    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        userId: userId!,
      },
      select: {
        id: true,
        title: true,
        description: true,
        isCompleted: true,
        isDeleted: true,
        dateCreated: true,
        dateUpdated: true,
      },
    });
    res
      .status(201)
      .json({ message: "Task created successfully!", task: newTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/", protect, async (req, res) => {
  const userId = req.userId;
  const { status } = req.query;

  let whereClause: Prisma.TaskWhereInput = {
    userId: userId,
  };

  if (status === "active") {
    whereClause.isCompleted = false;
    whereClause.isDeleted = false;
  } else if (status === "completed") {
    whereClause.isCompleted = true;
    whereClause.isDeleted = false;
  } else if (status === "trash") {
    whereClause.isDeleted = true;
  } else {
    whereClause.isCompleted = false;
    whereClause.isDeleted = false;
  }

  try {
    const tasks = await prisma.task.findMany({
      where: whereClause,
      orderBy: { dateCreated: "desc" },
    });
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/:id", protect, async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const task = await prisma.task.findUnique({
      where: { id, userId },
      select: {
        id: true,
        title: true,
        description: true,
        isCompleted: true,
        isDeleted: true,
        dateCreated: true,
        dateUpdated: true,
      },
    });

    if (!task) {
      return res
        .status(404)
        .json({ message: "Task not found or does not belong to user." });
    }
    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.patch("/:id", protect, async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  const { title, description } = req.body;

  if (!title && !description) {
    return res.status(400).json({
      message: "At least title or description must be provided for update.",
    });
  }

  try {
    const existingTask = await prisma.task.findUnique({
      where: { id, userId },
    });

    if (!existingTask) {
      return res
        .status(404)
        .json({ message: "Task not found or does not belong to user." });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title: title || existingTask.title,
        description: description || existingTask.description,
        dateUpdated: new Date(),
      },
      select: {
        id: true,
        title: true,
        description: true,
        isCompleted: true,
        isDeleted: true,
        dateCreated: true,
        dateUpdated: true,
      },
    });
    res
      .status(200)
      .json({ message: "Task updated successfully!", task: updatedTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/:id", protect, async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const existingTask = await prisma.task.findUnique({
      where: { id, userId },
    });

    if (!existingTask) {
      return res
        .status(404)
        .json({ message: "Task not found or does not belong to user." });
    }

    await prisma.task.update({
      where: { id },
      data: { isDeleted: true },
    });
    res.status(200).json({ message: "Task moved to trash successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.patch("/restore/:id", protect, async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const existingTask = await prisma.task.findUnique({
      where: { id, userId, isDeleted: true },
    });

    if (!existingTask) {
      return res.status(404).json({
        message: "Task not found in trash or does not belong to user.",
      });
    }

    await prisma.task.update({
      where: { id },
      data: { isDeleted: false, isCompleted: false },
    });
    res.status(200).json({ message: "Task restored successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.patch("/complete/:id", protect, async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const existingTask = await prisma.task.findUnique({
      where: { id, userId, isCompleted: false },
    });

    if (!existingTask) {
      return res.status(404).json({
        message:
          "Task not found, already completed, or does not belong to user.",
      });
    }

    await prisma.task.update({
      where: { id },
      data: { isCompleted: true },
    });
    res.status(200).json({ message: "Task marked as complete!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.patch("/incomplete/:id", protect, async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const existingTask = await prisma.task.findUnique({
      where: { id, userId, isCompleted: true },
    });

    if (!existingTask) {
      return res.status(404).json({
        message:
          "Task not found, already incomplete, or does not belong to user.",
      });
    }

    await prisma.task.update({
      where: { id },
      data: { isCompleted: false },
    });
    res.status(200).json({ message: "Task marked as incomplete!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/hard-delete/:id", protect, async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: "User not authenticated." });
  }

  try {
    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    if (task.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this task." });
    }

    if (!task.isDeleted) {
      return res.status(400).json({
        message: "Task is not in trash and cannot be permanently deleted.",
      });
    }

    await prisma.task.delete({
      where: { id },
    });

    res.status(200).json({ message: "Task permanently deleted successfully." });
  } catch (error) {
    console.error("Error permanently deleting task:", error);
    res.status(500).json({
      message: "Failed to permanently delete task.",
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

export default router;
