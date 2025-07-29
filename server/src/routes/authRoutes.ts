import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../index";
import { protect } from "../middleware/authMiddleware";
import { Prisma } from "@prisma/client";
import zxcvbn from "zxcvbn";

const router = Router();

const MIN_PASSWORD_STRENGTH_SCORE = 2;

const checkPasswordStrength = (password: string): string | null => {
  const result = zxcvbn(password);

  if (result.score < MIN_PASSWORD_STRENGTH_SCORE) {
    let message = `Password is too weak. Score: ${result.score}/4.`;
    if (result.feedback.warning) {
      message += ` Warning: ${result.feedback.warning}.`;
    }
    if (result.feedback.suggestions && result.feedback.suggestions.length > 0) {
      message += ` Suggestions: ${result.feedback.suggestions.join(", ")}.`;
    }
    return message;
  }
  return null;
};

router.post("/register", async (req, res) => {
  const { firstName, lastName, username, email, password } = req.body;

  if (!firstName || !lastName || !username || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const strengthError = checkPasswordStrength(password);
  if (strengthError) {
    return res.status(400).json({ message: strengthError });
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { username: username.toLowerCase() },
        ],
      },
    });

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Email or username already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        username: username.toLowerCase(),
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
      },
    });

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" },
    );

    res
      .status(201)
      .json({ message: "User registered successfully!", token, user });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return res
          .status(409)
          .json({ message: "Email or username already in use." });
      }
    }
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  const { emailOrUsername, password } = req.body;

  if (!emailOrUsername || !password) {
    return res
      .status(400)
      .json({ message: "Email/username and password are required." });
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: emailOrUsername.toLowerCase() },
          { username: emailOrUsername.toLowerCase() },
        ],
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        password: true,
        avatar: true,
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" },
    );

    const { password: _, ...userWithoutPassword } = user;
    res
      .status(200)
      .json({
        message: "Logged in successfully!",
        token,
        user: userWithoutPassword,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.patch("/password", protect, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.userId;

  if (!userId || !currentPassword || !newPassword) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const strengthError = checkPasswordStrength(newPassword);
  if (strengthError) {
    return res.status(400).json({ message: strengthError });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid current password." });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Password update error:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
});

export default router;
