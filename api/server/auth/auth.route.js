const express = require("express");
const validate = require("express-validation");
const expressJwt = require("express-jwt");
const paramValidation = require("../../config/param-validation");
const authCtrl = require("./auth.controller");
const config = require("../../config/config");
const userCtrl = require("../user/user.controller");
const CryptoUtil = require("../helpers/CryptoUtil");

const router = express.Router(); // eslint-disable-line new-cap

/** POST /api/auth/login - Returns token if correct userid and userpasswd is provided */
router.route("/login").post(validate(paramValidation.login), authCtrl.login);

/** POST /api/auth/logout - Returns success or fail */
router
  .route("/logout")
  .post(
    validate(paramValidation.logout),
    CryptoUtil.isLoggedIn,
    authCtrl.logout
  );

/** POST /api/auth/signup - Returns ok if correct userid and userpasswd is provided */
router
  .route("/signup")
  .post(validate(paramValidation.createUser), userCtrl.create);

/** GET /api/auth/random-number - Protected route,
 * needs token returned by the above as header. Authorization: Bearer {token} */
router
  .route("/random-number")
  .get(expressJwt({ secret: config.jwtSecret }), authCtrl.getRandomNumber);

/** POST /api/auth/logout - TODO need to implement */
module.exports = router;
