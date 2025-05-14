const express = require('express');
const userController = require('../controllers/UserController');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const otpController = require('../controllers/OtpController');
// GET /users?page=1&limit=10
router.get('/users',authMiddleware.requireAuth,roleMiddleware.requireRole(['admin']),userController.getAllUsers);
//auth
router.post('/register',userController.register);
router.post('/login', userController.login);

//protected routes
router.put('/profile', authMiddleware.requireAuth, userController.updateWithPassword);
router.put('/reset-password',authMiddleware.requireAuth, userController.resetPassword);
router.put('/profile/less', authMiddleware.requireAuth,userController.update);
router.delete("/delete", authMiddleware.requireAuth,roleMiddleware.requireRole(['admin']), userController.deleteUser);

//Email verification
router.post('/send-otp',authMiddleware.requireAuth,otpController.requestOTP);
router.post('/verify-otp',authMiddleware.requireAuth, otpController.verifyOTP);
module.exports = router;