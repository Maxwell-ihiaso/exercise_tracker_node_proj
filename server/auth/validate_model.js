const Joi = require('joi');

const authUser = Joi.object({
    username: Joi.string().trim().required(),
});

const authExercise = Joi.object({ 
    description: Joi.string().required(),
    duration: Joi.number().required(),
    date: Joi.date().default(Date.now), 
});

module.exports = {
    authUser, authExercise
}