import crypto from 'crypto';
import { User } from '../models/User.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateToken, generateResetToken } from '../utils/jwt.js';
import { createError } from '../middleware/errorHandler.js';

export class AuthService {
  static async signup(name: string, email: string, password: string) {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw createError('Email already registered', 409);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'user',
      theme_preference: 'system',
    });

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Return user without password
    const { password: _, reset_token: __, reset_token_expires: ___, ...userWithoutPassword } = user.toJSON();

    return {
      user: {
        ...userWithoutPassword,
        isVerified: true, // Add this for frontend compatibility
        resetToken: user.reset_token,
        resetTokenExpiry: user.reset_token_expires,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      },
      token,
    };
  }

  static async login(email: string, password: string) {
    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw createError('Invalid email or password', 401);
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw createError('Invalid email or password', 401);
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Return user without password
    const { password: _, reset_token: __, reset_token_expires: ___, ...userWithoutPassword } = user.toJSON();

    return {
      user: {
        ...userWithoutPassword,
        isVerified: true, // Add this for frontend compatibility
        resetToken: user.reset_token,
        resetTokenExpiry: user.reset_token_expires,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      },
      token,
    };
  }

  static async resetPasswordRequest(email: string) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Don't reveal if email exists or not for security
      return { message: 'If the email exists, a reset link has been sent' };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // Update user with reset token
    await user.update({
      reset_token: resetToken,
      reset_token_expires: resetTokenExpiry,
    });

    // In a real application, you would send an email here
    console.log(`Password reset token for ${email}: ${resetToken}`);

    return { message: 'If the email exists, a reset link has been sent' };
  }

  static async getAllUsers() {
    const users = await User.findAll({
      attributes: { exclude: ['password', 'reset_token', 'reset_token_expires'] },
      order: [['created_at', 'DESC']],
    });

    // Transform the data for frontend compatibility
    return users.map(user => ({
      ...user.toJSON(),
      isVerified: true,
      resetToken: user.reset_token,
      resetTokenExpiry: user.reset_token_expires,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    }));
  }

  static async updateUserRole(userId: number, role: 'user' | 'admin') {
    const user = await User.findByPk(userId);
    if (!user) {
      throw createError('User not found', 404);
    }

    await user.update({ role });

    const { password: _, reset_token: __, reset_token_expires: ___, ...userWithoutPassword } = user.toJSON();
    return {
      ...userWithoutPassword,
      isVerified: true,
      resetToken: user.reset_token,
      resetTokenExpiry: user.reset_token_expires,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  }

  static async deleteUser(userId: number) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw createError('User not found', 404);
    }

    await user.destroy();
    return { message: 'User deleted successfully' };
  }
}