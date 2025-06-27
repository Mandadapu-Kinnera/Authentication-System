import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { AuthService } from '../services/authService.js';

export class AuthController {
  static async signup(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = req.body;
      const result = await AuthService.signup(name, email, password);

      res.status(201).json({
        success: true,
        data: result,
        message: 'User registered successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Login successful',
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCurrentUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
      }

      res.status(200).json({
        success: true,
        data: { user: req.user },
        message: 'User retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  static async resetPasswordRequest(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const result = await AuthService.resetPasswordRequest(email);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllUsers(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const users = await AuthService.getAllUsers();

      res.status(200).json({
        success: true,
        data: { users },
        message: 'Users retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateUserRole(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { userId, role } = req.body;
      const result = await AuthService.updateUserRole(userId, role);

      res.status(200).json({
        success: true,
        data: { user: result },
        message: 'User role updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const result = await AuthService.deleteUser(parseInt(userId));

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}