/**
 * sproduct : set product info
 * Created by stub on 2017-10-12.
 */
"use strict";

var utils = require('../../constants/utils');
var async = require('async');
var moment = require('moment');

var sproduct = {
  execute : function(req, res, callback) {
    return execute(req, res, callback);
  }
};

function execute(req, res, callback) {
  logger.debug('---sproduct START---');

  var appId = (req.params && req.params.appId) || (req.body && req.body.appId) || (req.query && req.query.appId) || req.headers['x-appId'];
  var prodId = (req.params && req.params.prodId) || (req.body && req.body.prodId) || (req.query && req.query.prodId) || req.headers['x-prodId'];
  var prodImgUrl = (req.params && req.params.prodImgUrl) || (req.body && req.body.prodImgUrl) || (req.query && req.query.prodImgUrl) || req.headers['x-prodImgUrl'];
  var prodUrl = (req.params && req.params.prodUrl) || (req.body && req.body.prodUrl) || (req.query && req.query.prodUrl) || req.headers['x-prodUrl'];
  var prodQty = (req.params && req.params.prodQty) || (req.body && req.body.prodQty) || (req.query && req.query.prodQty) || req.headers['x-prodQty'];
  var prodName = (req.params && req.params.prodName) || (req.body && req.body.prodName) || (req.query && req.query.prodName) || req.headers['x-prodName'];
  var kword = (req.params && req.params.kword) || (req.body && req.body.kword) || (req.query && req.query.kword) || req.headers['x-kword'];
  var prodPrice = (req.params && req.params.prodPrice) || (req.body && req.body.prodPrice) || (req.query && req.query.prodPrice) || req.headers['x-prodPrice'];

  var userIP = (req.params && req.params.userIP) || (req.body && req.body.userIP) || (req.query && req.query.userIP) || req.headers['x-userIP'];
  // var userIP = utils.getUserIP(req);
  logger.debug('userIP ::: %j', userIP);

  logger.debug('appId ::: %j, prodId ::: %j, prodImgUrl ::: %j, prodUrl ::: %j, prodName ::: %j, kword ::: %j', 
                appId, prodId, prodImgUrl, prodUrl, prodName, kword);

  if (!appId || !prodId || !prodImgUrl || !prodUrl || !prodName || !kword) {
    var errorMessage = 'appId, prodId, prodImgUrl, prodUrl, prodName, kword required';
    logger.error(errorMessage);
    return callback(errorMessage);
  }

  if (!prodQty) prodQty = 1;

  const sequelize = utils.createConnection();
  const GdProd = sequelize.import('../../models/gd_prod');

  var prefix = 'GDPRD_';
  var gdProdId = utils.getUniqueID(prefix);

  GdProd.create({
    gdProdId: gdProdId,
    appId: appId,
    prodId: prodId,
    prodImgUrl: prodImgUrl,
    prodUrl: prodUrl,
    prodQty: prodQty,
    prodName: prodName,
    kword: kword,
    prodPrice: prodPrice,
    listFlag: 'Y',
    IP: userIP
  })
  .then(gdProd => {
    callback(null, 'success');

    logger.debug('---sproduct END---');
    sequelize.close();
  })
  .catch(err => {
    logger.error(err);

    callback(err);
    sequelize.close();
  })

  return;
}

module.exports = sproduct;
