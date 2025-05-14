const express = require('express');
const userController = require('../controllers/UserController');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// GET /users?page=1&limit=10
router.get('/users',roleMiddleware.requireRole,authMiddleware.requireAuth,userController.getAllUsers);
//auth
router.post('/register',userController.register);
router.post('/login', userController.login);

//protected routes
router.put('/profile', authMiddleware.requireAuth, userController.updateWithPassword);
router.put('/reset-password',authMiddleware.requireAuth, userController.resetPassword);
router.put('/profile/less', authMiddleware.requireAuth,userController.update);
module.exports = router;