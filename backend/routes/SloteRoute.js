const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const SlotController = require('../controllers/SlotController')
router.post('/get-parking-slot', authMiddleware.requireAuth,SlotController.createSlot);
router.get('/all',authMiddleware.requireAuth,SlotController.getAllSlots );
router.delete('/delete', authMiddleware.requireAuth, SlotController.deleteSlot);
module.exports=router;