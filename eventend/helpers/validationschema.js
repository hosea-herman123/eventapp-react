import Joi from 'joi';

export const authSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

export const roleUpdateSchema = Joi.object({
  userId: Joi.string().required(),
  role: Joi.string().valid('admin', 'customer', 'employee').required()
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required()
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  newPassword: Joi.string().min(6).required()
});

export const eventSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).max(1000).required(),
  date: Joi.date().greater('now').required(),
  location: Joi.string().min(5).max(200).required(),
  ticketPrice: Joi.number().min(0).required(),
  totalTickets: Joi.number().integer().min(1).required()
});

export const ticketPurchaseSchema = Joi.object({
  eventId: Joi.string().required(),
  ticketQuantity: Joi.number().integer().min(1).required(),
  phoneNumber: Joi.string()
    .pattern(/^0[17]\d{8}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must be 10 digits starting with 07 or 01'
    })
});
export const ticketTransferSchema = Joi.object({
  ticketId: Joi.string().required(),
  newOwnerEmail: Joi.string().email().required()
});

