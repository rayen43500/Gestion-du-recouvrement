const Joi = require('joi');

const paymentValidation = Joi.object({
  amount: Joi.number().min(0).required(),
  date: Joi.date().required(),
  method: Joi.string().valid('cash', 'cheque', 'transfer', 'other').required(),
  invoice: Joi.string().required(),
  client: Joi.string().required(),
  note: Joi.string().allow('', null)
});

module.exports = paymentValidation;
