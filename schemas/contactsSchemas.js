import Joi from "joi";

export const createContactSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    phone: Joi.string().pattern(/^[0-9]+$/).required(),
    email: Joi.string().email().required(),
})

export const updateContactSchema = Joi.object({
    name: Joi.string().min(3).max(30),
    phone: Joi.string().pattern(/^[0-9]+$/),
    email: Joi.string().email(),
})
