const Joi = require("joi");

const authExercise = Joi.object({
  description: Joi.string().required(),
  duration: Joi.number().required(),
  date: Joi.date().default(Date.now),
});

const authUser = Joi.object({
  username: Joi.string().trim().required(),
  log: Joi.array().items(authExercise),
});

module.exports = {
  authUser,
  authExercise,
};
