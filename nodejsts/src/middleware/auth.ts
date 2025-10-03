import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError, asyncHandler } from './errorHandler';
import { JwtPayload, Role } from '../types';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticateToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];

  if (!token) {
    throw new AppError('Access token required', 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    throw new AppError('Invalid or expired token', 401);
  }
});

export const authorizeRoles = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    if (!roles.includes(req.user.roles)) {
      throw new AppError('Insufficient permissions', 403);
    }

    next();
  };
};

export const publicRoute = (req: Request, res: Response, next: NextFunction) => {
  next();
};

// Decorator-like function for public routes
export const Public = () => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    // This is just a marker, actual handling is done in route definitions
  };
};

// Decorator-like function for role-based authorization
export const Roles = (...roles: Role[]) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    // This is just a marker, actual handling is done in route definitions
  };
};