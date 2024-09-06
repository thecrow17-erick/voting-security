import * as Joi from 'joi';

export const envSchema = Joi.object({
  DATABASE_URL : Joi.string().required(),
  PORT: Joi.number().default(3000)
})