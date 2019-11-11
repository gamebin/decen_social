/**
 * userlog : set user log
 * Created by stub on 2017-10-12.
 */
"use strict";

var utils = require('../../constants/utils');
var async = require('async');
var moment = require('moment');

var userlog = {
  execute : function(req, res, callback) {
    return execute(req, res, callback);
  }
};

function execute(req, res, callback) {
  logger.debug('---userlog START---');

  var appId  = (req.params && req.params.appId) || (req.body && req.body.appId) || (req.query && req.query.appId) || req.headers['x-appId'];
  var userId = (req.params && req.params.userId) || (req.body && req.body.userId) || (req.query && req.query.userId) || req.headers['x-userId'];
  var kword  = (req.params && req.params.kword) || (req.body && req.body.kword) || (req.query && req.query.kword) || req.headers['x-kword'];

  var userIP = (req.params && req.params.userIP) || (req.body && req.body.userIP) || (req.query && req.query.userIP) || req.headers['x-userIP'];
  // var userIP = utils.getUserIP(req);
  logger.debug('userIP ::: %j', userIP);

  if (!appId || !userId || !kword) {
    var errorMessage = 'appId, userId, kword required';
    logger.error(errorMessage);
    return callback(errorMessage);
  }

  const sequelize = utils.createConnection();
  const GdLog = sequelize.import('../../models/gd_log');

  var prefix = 'GDLOG_';
  var gdLogId = utils.getUniqueID(prefix);

  GdLog.create({
    gdLogId: gdLogId,
    appId: appId,
    userId: userId,
    kword: kword,
    IP: userIP
  })
  .then(gdLog => {
    callback(null, 'success');

    logger.debug('---userlog END---');
    sequelize.close();
  })
  .catch(err => {
    logger.error(err);

    callback(err);
    sequelize.close();
  })

  return;
}

module.exports = userlog;
