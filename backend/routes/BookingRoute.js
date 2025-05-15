const express = require("express");
const router = express.Router();
const bookingController = require('../controllers/BookingController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/',authMiddleware.requireAuth,bookingController.book);

module.exports=router;