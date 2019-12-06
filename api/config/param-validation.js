const Joi = require("joi");

module.exports = {
  // POST /api/linking/like
  createLiked : {
    body : {
      boardSerno : Joi.string().required(),
      userId     : Joi.string().required()
    }
  },

  // POST /api/linking/follow
  createFriend : {
    body : {
      userid   : Joi.string().required(),
      friendId : Joi.string().required()
    }
  },

  // DELETE /api/linking/remove
  removeFriend : {
    body : {
      userid   : Joi.string().required(),
      friendId : Joi.string().required()
    }
  },

  // POST /api/boards
  createBoard : {
    body : {
      boardtext : Joi.string().required(),
      userid    : Joi.string().required(),
      title     : Joi.string().required(),
      imageurl  : Joi.string()
    }
  },

  // UPDATE /api/boards/:boardSerno
  updateBoard : {
    body : {
      boardtext : Joi.string(),
      userid    : Joi.string(),
      title     : Joi.string(),
      imageurl  : Joi.string()
    },
    params : { boardSerno: Joi.string().required() }
  },

  // POST /api/products
  createProduct : {
    body : {
      boardtext : Joi.string().required(),
      userid    : Joi.string().required(),
      title     : Joi.string().required(),
      imageurl  : Joi.string()
    }
  },

  // UPDATE /api/products/:productSerno
  updateProduct : {
    body : {
      boardtext : Joi.string(),
      userid    : Joi.string(),
      title     : Joi.string(),
      imageurl  : Joi.string()
    },
    params : { productSerno: Joi.string().required() }
  },

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
      username   : Joi.string(),
      userpasswd : Joi.string(),
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
  },

  // POST /api/auth/logout
  logout : {
    body : {
      userid : Joi.string().required()
    }
  }
};
