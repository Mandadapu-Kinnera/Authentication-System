import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { signupSchema, loginSchema, resetPasswordSchema, roleUpdateSchema } from '../validation/authValidation.js';

const router = Router();

// Public routes
router.post('/signup', validate(signupSchema), AuthController.signup);
router.post('/login', validate(loginSchema), AuthController.login);
router.post('/reset-password', validate(resetPasswordSchema), AuthController.resetPasswordRequest);

// Protected routes
router.get('/me', authenticate, AuthController.getCurrentUser);

// Admin-only routes
router.get('/users', authenticate, authorize(['admin']), AuthController.getAllUsers);
router.put('/users/role', authenticate, authorize(['admin']), validate(roleUpdateSchema), AuthController.updateUserRole);
router.delete('/users/:userId', authenticate, authorize(['admin']), AuthController.deleteUser);

export default router;