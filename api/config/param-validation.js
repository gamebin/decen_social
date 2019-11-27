const Joi = require('joi');

module.exports = {
  // POST /api/users
  createUser : {
    body : {
      userid     : Joi.string().required(),
      username   : Joi.string().required(),
      userpasswd : Joi.string().required(),
      email      : Joi.string()
    }
  },

  // UPDATE /api/users/:userId
  updateUser : {
    body : {
      userid     : Joi.string().required(),
      username   : Joi.string().required(),
      userpasswd : Joi.string().required(),
      email      : Joi.string()
    },
    params : { userId: Joi.string().required() }
  },

  // POST /api/auth/login
  login : {
    body : {
      userid     : Joi.string().required(),
      userpasswd : Joi.string().required()
    }
  }
};
