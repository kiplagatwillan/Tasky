import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../index'; // Access the Prisma client instance
import { Prisma } from '@prisma/client';

const router = Router();

// Endpoint for user registration
router.post('/register', async (req, res) => {
  const { firstName, lastName, username, email, password } = req.body;

  try {
    // Check if user with this email or username already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { username: username.toLowerCase() }
        ]
      }
    });

    if (existingUser) {
      return res.status(409).json({ message: 'User with this email or username already exists.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user in the database
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        username,
        email: email.toLowerCase(),
        password: hashedPassword,
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

    res.status(201).json({ 
        message: 'User registered successfully. Please log in.',
        user: newUser
    });
    
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return res.status(409).json({ message: 'Email or username already in use.' });
      }
    }
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Endpoint for user login
router.post('/login', async (req, res) => {
  const { emailOrUsername, password } = req.body;

  try {
    // Find the user by email or username
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: emailOrUsername.toLowerCase() },
          { username: emailOrUsername.toLowerCase() }
        ]
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    
    // Create and sign a JSON Web Token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: '1h', 
    });

    res.status(200).json({ 
        message: 'Login successful.',
        token,
        user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
        } 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;