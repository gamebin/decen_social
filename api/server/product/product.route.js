const express = require("express");
const validate = require("express-validation");
const paramValidation = require("../../config/param-validation");
const productCtrl = require("./product.controller");

const router = express.Router(); // eslint-disable-line new-cap

router
  .route("/")

  /** POST /api/products - Create new product */
  .post(validate(paramValidation.createProduct), productCtrl.create);

router
  .route("/:productSerno")
  /** GET /api/products/:productSerno - Get product */
  .get(productCtrl.get)

  /** PUT /api/products/:productSerno - Update product */
  .put(validate(paramValidation.updateProduct), productCtrl.update)

  /** DELETE /api/products/:productSerno - Delete product */
  .delete(productCtrl.remove);

/** Load user when API with productSerno route parameter is hit */
router.param("productSerno", productCtrl.load);

module.exports = router;
