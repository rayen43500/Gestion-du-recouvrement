const Joi = require('joi');

const collectionActionValidation = Joi.object({
  actionType: Joi.string().valid('call', 'email', 'letter', 'visit', 'legal', 'other').required(),
  date: Joi.date().required(),
  agent: Joi.string().required(),
  client: Joi.string().required(),
  invoice: Joi.string().required(),
  status: Joi.string().valid('pending', 'completed', 'failed').default('pending'),
  note: Joi.string().allow('', null)
});

module.exports = collectionActionValidation;
