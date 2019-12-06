const httpStatus = require("http-status");
const APIError = require("../helpers/APIError");
const User = require("./user.model");

/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  console.debug("user.controller.load.id:", id);
  User.getUserInfoBySerno(id)
    .then(user => {
      req.user = user; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
  return res.json(req.user);
}

/**
 * Create new user
 * @property {string} req.body.userid - The userid of user.
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.userpasswd - The userpasswd of user.
 * @property {string} req.body.email - The email of user.
 * @returns {User}
 */
async function create(req, res, next) {
  let encryptPasswd = await genPW(req.body.userpasswd);
  let userIp = getUserIP(req);
  let userData = {
    userid     : req.body.userid,
    username   : req.body.username,
    userpasswd : encryptPasswd,
    email      : req.body.email || "0",
    regYHS     : new Date(),
    userIp     : userIp
  };
  console.debug("create.userData:", userData);

  User.getUserInfoByUserId(req.body.userid)
    .then(userInfo => {
      if (userInfo != null) {
        const err = new APIError(
          "Authentication error",
          httpStatus.UNAUTHORIZED,
          true
        );
        console.debug("err:", err);
        return next(err);
      } else {
        User.createUser(userData)
          .then(savedUser => {
            let rtnValue = {
              success : true,
              message : ""
            };
            res.json(rtnValue);
          })
          .catch(e => next(e));
      }
    })
    .catch(e => {
      console.debug("e:", e);
      User.createUser(userData)
        .then(savedUser => {
          let rtnValue = {
            success : true,
            message : ""
          };
          res.json(rtnValue);
        })
        .catch(e => next(e));
    });
}

/**
 * Update existing user
 * @property {string} req.body.userid - The userid of user.
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.userpasswd - The userpasswd of user.
 * @property {string} req.body.email - The email of user.
 * @returns {User}
 */
function update(req, res, next) {
  const user = req.user;
  let encryptPasswd = req.body.userpasswd
    ? genPW(req.body.userpasswd)
    : user.userpasswd;
  let userData = {
    userserno  : user.userserno,
    userid     : req.body.userid || user.userid,
    username   : req.body.username || user.username,
    userpasswd : encryptPasswd,
    email      : req.body.email || user.email
  };

  User.updateUser(userData)
    .then(savedUser => {
      let rtnValue = {
        success : true,
        message : "",
        result  : savedUser
      };
      res.json(rtnValue);
    })
    .catch(e => {
      console.error(e);
      next(e);
    });
}

/**
 * Delete user.
 * @returns {User}
 */
function remove(req, res, next) {
  const user = req.user;

  User.deleteUser(user)
    .then(deletedUser => {
      let rtnValue = {
        success : true,
        message : ""
      };
      res.json(rtnValue);
    })
    .catch(e => next(e));
}

function genPW(passwd) {
  const crypto = require("crypto");
  return crypto
    .createHash("sha256")
    .update(passwd)
    .digest("base64");
}

function getUserIP(req) {
  let ipAddress;

  if (!!req.hasOwnProperty("sessionID")) {
    ipAddress = req.headers["x-forwarded-for"];
  } else {
    if (!ipAddress) {
      let forwardedIpsStr = req.header("x-forwarded-for");

      if (forwardedIpsStr) {
        let forwardedIps = forwardedIpsStr.split(",");
        ipAddress = forwardedIps[0];
      }
      if (!ipAddress) {
        ipAddress = req.connection.remoteAddress;
      }
    }
  }

  let idxColon = ipAddress.lastIndexOf(":");
  let rtnValue = ipAddress.substring(idxColon + 1, ipAddress.length);
  console.debug(rtnValue);
  return rtnValue;
}

module.exports = { load, get, create, update, remove, genPW, getUserIP };
