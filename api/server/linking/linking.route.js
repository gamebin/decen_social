const express = require("express");
const validate = require("express-validation");
const paramValidation = require("../../config/param-validation");
const linkingCtrl = require("./linking.controller");
const CryptoUtil = require("../helpers/CryptoUtil");

const router = express.Router(); // eslint-disable-line new-cap

router
  .route("/follow")

  /** POST /api/linking/follow - Create new friend */
  .post(
    validate(paramValidation.createFriend),
    CryptoUtil.isLoggedIn,
    linkingCtrl.create
  );

router
  .route("/remove")

  /** DELETE /api/linking/remove - Delete friend */
  .delete(
    validate(paramValidation.removeFriend),
    CryptoUtil.isLoggedIn,
    linkingCtrl.remove
  );

router
  .route("/like")

  /** POST /api/linking - Create new liked */
  .post(
    validate(paramValidation.createLiked),
    CryptoUtil.isLoggedIn,
    linkingCtrl.like
  );

/** Load friend when API with friendSerno route parameter is hit */
// router.param("friendSerno", linkingCtrl.load);

module.exports = router;
