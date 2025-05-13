const express = require('express');
const userController = require('../controllers/UserController');
const router = express.Router();


// GET /users?page=1&limit=10
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (page < 1 || limit < 1) {
      return res.status(400).json({ error: 'Invalid pagination parameters' });
    }

    const { users, pagination } = await User.getAllPaginated(page, limit);
    res.json({ users, pagination });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/register',userController.register);
router.post('/login', userController.login);
module.exports = router;