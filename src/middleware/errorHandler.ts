import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const createError = (message: string, statusCode: number = 500): AppError => {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};

export const errorHandler = (
  error: AppError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', error);

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const errors = error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));

    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors,
    });
  }

  // Handle Sequelize errors
  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Database validation failed',
      message: error.message,
    });
  }

  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      success: false,
      error: 'Resource already exists',
      message: 'Email already registered',
    });
  }

  // Handle custom application errors
  if ('statusCode' in error && error.statusCode) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message,
    });
  }

  // Handle unknown errors
  return res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
  });
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.path}`,
  });
};