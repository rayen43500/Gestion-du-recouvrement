const Joi = require('joi');
const { ROLES } = require('../config/constants');

// Register validation schema
const registerSchema = Joi.object({
  firstName: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'First name cannot be empty',
      'string.min': 'First name must be at least 2 characters',
      'any.required': 'First name is required'
    }),
  lastName: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Last name cannot be empty',
      'string.min': 'Last name must be at least 2 characters',
      'any.required': 'Last name is required'
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email',
      'string.empty': 'Email cannot be empty',
      'any.required': 'Email is required'
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters',
      'string.empty': 'Password cannot be empty',
      'any.required': 'Password is required'
    }),
  phone: Joi.string()
    .optional()
    .allow(null, '')
    .messages({
      'string.pattern.base': 'Invalid phone number format'
    })
});

// Login validation schema
const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email',
      'string.empty': 'Email cannot be empty',
      'any.required': 'Email is required'
    }),
  password: Joi.string()
    .required()
    .messages({
      'string.empty': 'Password cannot be empty',
      'any.required': 'Password is required'
    })
});

// Update user validation schema
const updateUserSchema = Joi.object({
  firstName: Joi.string()
    .min(2)
    .max(50)
    .optional(),
  lastName: Joi.string()
    .min(2)
    .max(50)
    .optional(),
  email: Joi.string()
    .email()
    .optional(),
  phone: Joi.string()
    .optional()
    .allow(null, ''),
  role: Joi.string()
    .valid(...Object.values(ROLES))
    .optional()
    .messages({
      'any.only': `Role must be one of: ${Object.values(ROLES).join(', ')}`
    }),
  status: Joi.string()
    .valid('active', 'inactive', 'suspended')
    .optional()
    .messages({
      'any.only': 'Status must be active, inactive or suspended'
    })
}).min(1);

// Change password validation schema
const changePasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .required()
    .messages({
      'any.required': 'Current password is required'
    }),
  newPassword: Joi.string()
    .min(6)
    .required()
    .invalid(Joi.ref('currentPassword'))
    .messages({
      'string.min': 'New password must be at least 6 characters',
      'any.required': 'New password is required',
      'any.invalid': 'New password must be different from current password'
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({
      'any.only': 'Passwords do not match',
      'any.required': 'Password confirmation is required'
    })
});

module.exports = {
  registerSchema,
  loginSchema,
  updateUserSchema,
  changePasswordSchema
};
