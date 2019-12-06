const express = require("express");
const validate = require("express-validation");
const paramValidation = require("../../config/param-validation");
const boardCtrl = require("./board.controller");
const CryptoUtil = require("../helpers/CryptoUtil");

const router = express.Router(); // eslint-disable-line new-cap

router
  .route("/")

  /** POST /api/boards - Create new board */
  .post(
    validate(paramValidation.createBoard),
    CryptoUtil.isLoggedIn,
    boardCtrl.create
  );

router
  .route("/:boardSerno")
  /** GET /api/boards/:boardSerno - Get board */
  .get(boardCtrl.get)

  /** PUT /api/boards/:boardSerno - Update board */
  .put(
    validate(paramValidation.updateBoard),
    CryptoUtil.isLoggedIn,
    boardCtrl.update
  )

  /** DELETE /api/boards/:boardSerno - Delete board */
  .delete(CryptoUtil.isLoggedIn, boardCtrl.remove);

/** Load board when API with boardSerno route parameter is hit */
router.param("boardSerno", boardCtrl.load);

module.exports = router;
