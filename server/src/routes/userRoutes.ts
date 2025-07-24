import { Router } from 'express';
import { prisma } from '../index';
import { protect } from '../middleware/authMiddleware';
import { Prisma } from '@prisma/client';

const router = Router();

// Endpoint to get the logged-in user's details
router.get('/', protect, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        avatar: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Endpoint to update the logged-in user's primary information
router.patch('/', protect, async (req, res) => {
  const { firstName, lastName, username, email } = req.body;

  if (!firstName || !lastName || !username || !email) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  
  try {
    // Check if the new email or username is already in use by another user
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { username: username.toLowerCase() }
        ],
        NOT: { id: req.userId }
      }
    });

    if (existingUser) {
      return res.status(409).json({ message: 'Email or username already in use.' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.userId },
      data: {
        firstName,
        lastName,
        username: username.toLowerCase(),
        email: email.toLowerCase(),
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        avatar: true,
      }
    });

    res.status(200).json({
      message: 'Profile updated successfully.',
      user: updatedUser,
    });
  } catch (error) {
     if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') { // Unique constraint violation
        return res.status(409).json({ message: 'Email or username already in use.' });
      }
    }
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;