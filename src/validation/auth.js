import Joi from 'joi';

export const registerUserSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    'string.base': 'Username should be a string', // Кастомізація повідомлення для типу "string"
    'string.empty': 'Username is not allowed to be empty',
    'string.min': 'Username should have at least {#limit} characters',
    'string.max': 'Username should have at most {#limit} characters',
    'any.required': 'Username is required',
  }),
  email: Joi.string().email().required().messages({
    'string.base': 'E-mail should be a string', // Кастомізація повідомлення
    'string.empty': 'E-mail is not allowed to be empty',
    'string.email': 'The string is not a valid e-mail',
    'any.required': 'E-mail is required',
  }),
  password: Joi.string().required().messages({
    'string.base': 'Password should be a string', // Кастомізація повідомлення
    'string.empty': 'Password is not allowed to be empty',
    'any.required': 'Password is required',
  }),
  role: Joi.string().valid('parent'),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.base': 'E-mail should be a string', // Кастомізація повідомлення
    'string.empty': 'E-mail is not allowed to be empty',
    'string.email': 'The string is not a valid e-mail',
    'any.required': 'E-mail is required',
  }),
  password: Joi.string().required().messages({
    'string.base': 'Password should be a string', // Кастомізація повідомлення
    'string.empty': 'Password is not allowed to be empty',
    'any.required': 'Password is required',
  }),
});

export const requestResetEmailSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.base': 'E-mail should be a string', // Кастомізація повідомлення
    'string.empty': 'E-mail is not allowed to be empty',
    'string.email': 'The string is not a valid e-mail',
    'any.required': 'E-mail is required',
  }),
});

export const resetPasswordSchema = Joi.object({
  password: Joi.string().required().messages({
    'string.base': 'Password should be a string', // Кастомізація повідомлення
    'string.empty': 'Password is not allowed to be empty',
    'any.required': 'Password is required',
  }),
  token: Joi.string().required().messages({
    'string.base': 'Token should be a string', // Кастомізація повідомлення
    'string.empty': 'Token is not allowed to be empty',
    'any.required': 'Token is required',
  }),
});
