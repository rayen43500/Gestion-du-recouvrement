const { ERROR_MESSAGES } = require('../config/constants');

// Middleware to check user role
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: ERROR_MESSAGES.UNAUTHORIZED,
        error: 'Please authenticate'
      });
    }

    // Check if user has required role
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: ERROR_MESSAGES.FORBIDDEN,
        error: `Access limited to roles: ${allowedRoles.join(', ')}`
      });
    }

    next();
  };
};

module.exports = { authorize };
