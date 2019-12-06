const httpStatus = require("http-status");
const APIError = require("../helpers/APIError");
const Product = require("./product.model");

/**
 * Load product and append to req.
 */
function load(req, res, next, id) {
  console.debug("product.controller.load.id:", id);
  Product.getProductInfoBySerno(id)
    .then(product => {
      req.product = product; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get product
 * @returns {Product}
 */
function get(req, res) {
  return res.json(req.product);
}

/**
 * Create new product
 * @property {string} req.body.boardtext - The boardtext of product.
 * @property {string} req.body.userid - The userid of product.
 * @property {string} req.body.title - The title of product.
 * @property {string} req.body.imageurl - The imageurl of product.
 * @returns {Product}
 */
function create(req, res, next) {
  let userIp = getUserIP(req);
  let productData = {
    boardtext : req.body.boardtext,
    userid    : req.body.userid,
    title     : req.body.title,
    imageurl  : req.body.imageurl,
    regYHS    : new Date(),
    userIp    : userIp
  };

  Product.createProduct(productData)
    .then(savedProduct => {
      let rtnValue = {
        success : true,
        message : "",
        result  : savedProduct
      };
      res.json(rtnValue);
    })
    .catch(e => next(e));
}

/**
 * Update existing product
 * @property {string} req.body.boardtext - The boardtext of product.
 * @property {string} req.body.userid - The userid of product.
 * @property {string} req.body.title - The title of product.
 * @property {string} req.body.imageurl - The imageurl of product.
 * @returns {Product}
 */
function update(req, res, next) {
  const product = req.product;
  let productData = {
    boardSerno : product.boardSerno,
    boardtext  : req.body.boardtext || product.boardtext,
    userid     : req.body.userid || product.userid,
    title      : req.body.title || product.title,
    imageurl   : req.body.imageurl || product.imageurl
  };

  Product.updateProduct(productData)
    .then(savedProduct => {
      let rtnValue = {
        success : true,
        message : "",
        result  : savedProduct
      };
      res.json(rtnValue);
    })
    .catch(e => {
      console.error(e);
      next(e);
    });
}

/**
 * Delete product.
 * @returns {Product}
 */
function remove(req, res, next) {
  const product = req.product;

  Product.deleteProduct(product)
    .then(deletedProduct => {
      let rtnValue = {
        success : true,
        message : ""
      };
      res.json(rtnValue);
    })
    .catch(e => next(e));
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

module.exports = { load, get, create, update, remove, getUserIP };
