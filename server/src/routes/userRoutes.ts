import { Router } from 'express';
import { prisma } from '../index';
import { protect } from '../middleware/authMiddleware';
import { Prisma } from '@prisma/client';
import multer from 'multer'; 
import path from 'path';     
import fs from 'fs';        

const router = Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    
    const uploadPath = path.join(__dirname, '../../uploads');
   
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const userId = req.userId;
    if (!userId) {
      
      return cb(new Error('User ID not found for avatar upload'), '');
    }
    const fileExtension = path.extname(file.originalname);
    cb(null, `${userId}${fileExtension}`); 
  },
});


const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } 
});


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


router.patch('/', protect, async (req, res) => {
  const { firstName, lastName, username, email } = req.body;

  if (!firstName || !lastName || !username || !email) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
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
      if (error.code === 'P2002') { 
        return res.status(409).json({ message: 'Email or username already in use.' });
      }
    }
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.patch('/avatar', protect, upload.single('avatar'), async (req, res) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated.' });
  }

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  try {
    
    const avatarPath = `/uploads/${req.file.filename}`;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        avatar: avatarPath,
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
      message: 'Profile picture updated successfully.',
      user: updatedUser,
    });
  } catch (error: any) {
    console.error('Error uploading avatar:', error);
    
    if (error.message === 'Only image files are allowed!' || error.message.includes('File too large')) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal Server Error during avatar upload.' });
  }
});

export default router;