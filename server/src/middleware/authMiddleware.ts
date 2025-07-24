import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend the Express Request object to include a userId property
declare global {
    namespace Express {
      interface Request {
        userId?: string;
      }
    }
}

interface DecodedToken {
    userId: string;
    iat: number;
    exp: number;
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization token not found.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
};