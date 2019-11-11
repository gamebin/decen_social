/**
 * uproduct : update product info
 * Created by stub on 2017-10-12.
 */
"use strict";

var utils = require('../../constants/utils');
var async = require('async');
var moment = require('moment');

var uproduct = {
  execute : function(req, res, callback) {
    return execute(req, res, callback);
  }
};

function execute(req, res, callback) {
  logger.debug('---uproduct START---');

  var appId = (req.params && req.params.appId) || (req.body && req.body.appId) || (req.query && req.query.appId) || req.headers['x-appId'];
  var prodId = (req.params && req.params.prodId) || (req.body && req.body.prodId) || (req.query && req.query.prodId) || req.headers['x-prodId'];
  var prodQty = (req.params && req.params.prodQty) || (req.body && req.body.prodQty) || (req.query && req.query.prodQty) || req.headers['x-prodQty'];

  var userIP = (req.params && req.params.userIP) || (req.body && req.body.userIP) || (req.query && req.query.userIP) || req.headers['x-userIP'];
  // var userIP = utils.getUserIP(req);
  logger.debug('userIP ::: %j', userIP);

  logger.debug('appId ::: %j, prodId ::: %j, prodQty ::: %j', appId, prodId, prodQty);
  
  if (!appId || !prodId || !prodQty) {
    var errorMessage = 'appId, prodId, prodQty required';
    logger.error(errorMessage);
    return callback(errorMessage);
  }

  const sequelize = utils.createConnection();
  const GdProd = sequelize.import('../../models/gd_prod');

  if (prodQty == 0) {
    GdProd.update(
      {
        prodQty: prodQty,
        listFlag: 'N',
        updateYHS: new Date()
      }, 
      { 
        where: { appId: appId, prodId: prodId }
    })
    .then(gdProd => {
      logger.debug('gdProd.update.success ::: %j', gdProd);
      callback(null, 'success');
      logger.debug('---uproduct END---');
    })
    .catch(err => {
      logger.error('gdProd.update.err :: %j', err);
      callback(err);
    })
  } else {
    GdProd.update(
      {
        prodQty: prodQty,
        updateYHS: new Date()
      }, 
      { 
        where: { appId: appId, prodId: prodId }
    })
    .then(gdProd => {
      logger.debug('gdProd.update.success ::: %j', gdProd);
      callback(null, 'success');
      logger.debug('---uproduct END---');
      sequelize.close();
    })
    .catch(err => {
      logger.error('gdProd.update.err :: %j', err);
      callback(err);
      sequelize.close();
    })
  }

  return;
}

module.exports = uproduct;
