const express = require('express');
const userController = require('../controllers/UserController');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const otpController = require('../controllers/OtpController');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and authentication
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Number of users per page
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/users', authMiddleware.requireAuth, roleMiddleware.requireRole(['admin']), userController.getAllUsers);

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post('/register', userController.register);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login', userController.login);

/**
 * @swagger
 * /profile:
 *   put:
 *     summary: Update profile with password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.put('/profile', authMiddleware.requireAuth, userController.updateWithPassword);

/**
 * @swagger
 * /reset-password:
 *   put:
 *     summary: Reset password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Password reset successfully
 */
router.put('/reset-password', authMiddleware.requireAuth, userController.resetPassword);

/**
 * @swagger
 * /profile/less:
 *   put:
 *     summary: Update profile without password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.put('/profile/less', authMiddleware.requireAuth, userController.update);

/**
 * @swagger
 * /delete:
 *   delete:
 *     summary: Delete a user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted
 */
router.delete('/delete', authMiddleware.requireAuth, roleMiddleware.requireRole(['admin']), userController.deleteUser);

/**
 * @swagger
 * /send-otp:
 *   post:
 *     summary: Send OTP for email verification
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OTP sent
 */
router.post('/send-otp', authMiddleware.requireAuth, otpController.requestOTP);

/**
 * @swagger
 * /verify-otp:
 *   post:
 *     summary: Verify OTP for email
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OTP verified
 */
router.post('/verify-otp', authMiddleware.requireAuth, otpController.verifyOTP);

module.exports = router;
