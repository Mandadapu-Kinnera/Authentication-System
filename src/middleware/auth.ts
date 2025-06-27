import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';
import { User } from '../models/User.js';

export interface AuthenticatedRequest extends Request {
  user?: any; // Using any to avoid type conflicts with the transformed user object
}

export const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Access token required',
      });
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = verifyToken(token);
      const user = await User.findByPk(decoded.userId, {
        attributes: { exclude: ['password', 'reset_token', 'reset_token_expires'] },
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'User not found',
        });
      }

      // Transform user data for frontend compatibility
      req.user = {
        ...user.toJSON(),
        isVerified: true,
        resetToken: user.reset_token,
        resetTokenExpiry: user.reset_token_expires,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      };
      
      next();
    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token',
      });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      error: 'Authentication failed',
    });
  }
};

export const authorize = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
      });
    }

    next();
  };
};