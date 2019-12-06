const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");
const APIError = require("../helpers/APIError");
const config = require("../../config/config");
const userCtrl = require("../user/user.controller");
const User = require("../user/user.model");

/**
 * Returns jwt token if valid userid and userpasswd is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
async function login(req, res, next) {
  const userData = await User.getUserInfoByUserId(req.body.userid);

  // console.debug('req.body.user:', req.body.userid, ' userData.userid:', userData.userid);
  // console.debug('userCtrl.genPW(req.body.userpasswd):', userCtrl.genPW(req.body.userpasswd), ' userData.userpasswd:', userData.userpasswd);
  if (
    req.body.userid === userData.userid &&
    userCtrl.genPW(req.body.userpasswd) === userData.userpasswd
  ) {
    const token = jwt.sign({ userid: userData.userid }, config.jwtSecret);
    return res.json({
      token,
      userserno : userData.userserno,
      userid    : userData.userid
    });
  }

  const err = new APIError(
    "Authentication error",
    httpStatus.UNAUTHORIZED,
    true
  );
  return next(err);
}

/**
 * Returns success if valid userid and token is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
async function logout(req, res, next) {
  const userData = await User.getUserInfoByUserId(req.body.userid);

  if (req.body.userid === userData.userid) {
    jwt.verify(
      req.headers["x-access-token"],
      config.jwtSecret,
      (err, decoded) => {
        if (decoded.userid === req.body.userid)
          return res.json({ success: true, message: "" });
        else return res.json({ success: false, message: "Fail to logout" });
      }
    );
  }

  const err = new APIError(
    "Authentication error",
    httpStatus.UNAUTHORIZED,
    true
  );
  return next(err);
}

/**
 * This is a protected route. Will return random number only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
function getRandomNumber(req, res) {
  // req.user is assigned by jwt middleware if valid token is provided
  return res.json({
    user : req.user,
    num  : Math.random() * 100
  });
}

module.exports = { login, logout, getRandomNumber };
