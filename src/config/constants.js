// User Roles
const ROLES = {
  AGENT: 'agent',
  MANAGER: 'manager',
  ADMIN: 'admin'
};

// User Status
const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended'
};

// Error Messages
const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_EXISTS: 'Email already registered',
  USER_NOT_FOUND: 'User not found',
  UNAUTHORIZED: 'Unauthorized',
  FORBIDDEN: 'Access forbidden',
  INVALID_TOKEN: 'Invalid or expired token',
  VALIDATION_ERROR: 'Validation error',
  INTERNAL_ERROR: 'Internal server error'
};

module.exports = {
  ROLES,
  USER_STATUS,
  ERROR_MESSAGES
};
