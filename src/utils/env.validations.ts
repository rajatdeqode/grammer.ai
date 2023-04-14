import * as Joi from 'joi';

export const schema = Joi.object({
  PORT: Joi.number().required().default(3001),
  DB_URL: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  ACCESS_TOKEN_SECRET: Joi.string().required(),
  REFRESH_TOKEN_SECRET: Joi.string().required(),
  ACCESS_TOKEN_EXPIRES: Joi.string().required(),
  REFRESH_TOKEN_EXPIRES: Joi.string().required(),
});
