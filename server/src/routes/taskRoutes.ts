import { Router } from 'express';
import { prisma } from '../index';
import { protect } from '../middleware/authMiddleware';
import { Prisma } from '@prisma/client';

const router = Router();

// Endpoint to create a new task
router.post('/', protect, async (req, res) => {
  const { title, description } = req.body;
  const userId = req.userId; // Retrieved from protect middleware

  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required.' });
  }

  try {
    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        userId: userId!, // userId is guaranteed by protect middleware
      },
      select: {
        id: true,
        title: true,
        description: true,
        isCompleted: true,
        isDeleted: true,
        dateCreated: true,
        dateUpdated: true,
      }
    });
    res.status(201).json({ message: 'Task created successfully!', task: newTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Endpoint to get all tasks for the logged-in user
// Supports filtering for active, completed, or trashed tasks
router.get('/', protect, async (req, res) => {
  const userId = req.userId;
  const { status } = req.query; // 'active', 'completed', 'trash'

  let whereClause: Prisma.TaskWhereInput = {
    userId: userId,
  };

  if (status === 'active') {
    whereClause.isCompleted = false;
    whereClause.isDeleted = false;
  } else if (status === 'completed') {
    whereClause.isCompleted = true;
    whereClause.isDeleted = false;
  } else if (status === 'trash') {
    whereClause.isDeleted = true;
  } else {
    // Default: return active tasks if no status or invalid status is provided
    whereClause.isCompleted = false;
    whereClause.isDeleted = false;
  }

  try {
    const tasks = await prisma.task.findMany({
      where: whereClause,
      orderBy: { dateCreated: 'desc' }, // Order by creation date, newest first
    });
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Endpoint to get a specific task by ID for the logged-in user
router.get('/:id', protect, async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const task = await prisma.task.findUnique({
      where: { id, userId }, // Ensure the task belongs to the user
      select: {
        id: true,
        title: true,
        description: true,
        isCompleted: true,
        isDeleted: true,
        dateCreated: true,
        dateUpdated: true,
      }
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found or does not belong to user.' });
    }
    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Endpoint to update a task (title and description)
router.patch('/:id', protect, async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  const { title, description } = req.body;

  if (!title && !description) {
    return res.status(400).json({ message: 'At least title or description must be provided for update.' });
  }

  try {
    // First, verify the task belongs to the user
    const existingTask = await prisma.task.findUnique({
      where: { id, userId },
    });

    if (!existingTask) {
      return res.status(404).json({ message: 'Task not found or does not belong to user.' });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title: title || existingTask.title, // Only update if provided
        description: description || existingTask.description, // Only update if provided
        dateUpdated: new Date(), // Manually update this as well or rely on @updatedAt
      },
      select: {
        id: true,
        title: true,
        description: true,
        isCompleted: true,
        isDeleted: true,
        dateCreated: true,
        dateUpdated: true,
      }
    });
    res.status(200).json({ message: 'Task updated successfully!', task: updatedTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Endpoint to mark a task as deleted (soft delete)
router.delete('/:id', protect, async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    // First, verify the task belongs to the user
    const existingTask = await prisma.task.findUnique({
      where: { id, userId },
    });

    if (!existingTask) {
      return res.status(404).json({ message: 'Task not found or does not belong to user.' });
    }

    await prisma.task.update({
      where: { id },
      data: { isDeleted: true },
    });
    res.status(200).json({ message: 'Task moved to trash successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Endpoint to restore a deleted task
router.patch('/restore/:id', protect, async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    // Verify task belongs to user and is actually deleted
    const existingTask = await prisma.task.findUnique({
      where: { id, userId, isDeleted: true },
    });

    if (!existingTask) {
      return res.status(404).json({ message: 'Task not found in trash or does not belong to user.' });
    }

    await prisma.task.update({
      where: { id },
      data: { isDeleted: false, isCompleted: false }, // Restore means it's not deleted and not completed
    });
    res.status(200).json({ message: 'Task restored successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Endpoint to mark a task as completed
router.patch('/complete/:id', protect, async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    // Verify task belongs to user and is not already completed
    const existingTask = await prisma.task.findUnique({
      where: { id, userId, isCompleted: false },
    });

    if (!existingTask) {
      return res.status(404).json({ message: 'Task not found, already completed, or does not belong to user.' });
    }

    await prisma.task.update({
      where: { id },
      data: { isCompleted: true },
    });
    res.status(200).json({ message: 'Task marked as complete!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Endpoint to mark a task as incomplete
router.patch('/incomplete/:id', protect, async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    // Verify task belongs to user and is not already incomplete
    const existingTask = await prisma.task.findUnique({
      where: { id, userId, isCompleted: true },
    });

    if (!existingTask) {
      return res.status(404).json({ message: 'Task not found, already incomplete, or does not belong to user.' });
    }

    await prisma.task.update({
      where: { id },
      data: { isCompleted: false },
    });
    res.status(200).json({ message: 'Task marked as incomplete!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;