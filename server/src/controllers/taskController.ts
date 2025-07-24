// // ... existing imports and functions (getAllTasks, getTaskById, createTask, updateTask, softDeleteTask, completeTask, incompleteTask) ...

// import { Request, Response } from 'express';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// // ... (rest of your existing controller functions) ...

// export const permanentlyDeleteTask = async (req: Request, res: Response) => {
//     const { id } = req.params;
//     const userId = req.userId; // From protect middleware

//     if (!userId) {
//         return res.status(401).json({ message: 'User not authenticated.' });
//     }

//     try {
//         // Optional: Verify that the task belongs to the user and is currently soft-deleted
//         const task = await prisma.task.findUnique({
//             where: { id },
//         });

//         if (!task) {
//             return res.status(404).json({ message: 'Task not found.' });
//         }

//         if (task.userId !== userId) {
//             return res.status(403).json({ message: 'Not authorized to delete this task.' });
//         }

//         if (!task.isDeleted) {
//             return res.status(400).json({ message: 'Task is not in trash and cannot be permanently deleted.' });
//         }

//         await prisma.task.delete({
//             where: { id },
//         });

//         res.status(200).json({ message: 'Task permanently deleted successfully.' });
//     } catch (error) {
//         console.error('Error permanently deleting task:', error);
//         res.status(500).json({ message: 'Failed to permanently delete task.', error: error instanceof Error ? error.message : String(error) });
//     }
// };