const User = require('../models/User.model');

// Middleware to restrict access by role
const requireRole = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.userId) {
        return res.status(401).json({ error: "Unauthorized: Missing user data" });
      }

      const userId = req.user.userId;
      const userRole = await User.getRole(userId);

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ error: "Access denied: Insufficient role" });
      }

      next();
    } catch (err) {
      console.error("Role check error:", err);
      res.status(500).json({ error: "Server error during role verification" });
    }
  };
};

module.exports = { requireRole };
