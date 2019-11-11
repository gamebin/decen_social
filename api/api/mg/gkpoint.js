/**
 * Deprecated API
 * 
 * gkpoint : example extenal API
 * Created by stub on 2018-08-06.
 */

"use strict";

var utils = require('../../constants/utils');
var async = require('async');

var gkpoint = {
  execute : function(req, res, callback) {
    return execute(req, res, callback);
  }
};

function execute(req, res, callback) {
  logger.debug('---gkpoint START---');

  var gk_key = (req.params && req.params.gk_key) || (req.body && req.body.gk_key) || (req.query && req.query.gk_key) || req.headers['x-gk_key'];
  var gk_secret = (req.params && req.params.gk_secret) || (req.body && req.body.gk_secret) || (req.query && req.query.gk_secret) || req.headers['x-gk_secret'];
  var mgId = (req.params && req.params.mgId) || (req.body && req.body.mgId) || (req.query && req.query.mgId) || req.headers['x-mgId'];
  var hostId = (req.params && req.params.hostId) || (req.body && req.body.hostId) || (req.query && req.query.hostId) || req.headers['x-hostId'];
  var userId = (req.params && req.params.userId) || (req.body && req.body.userId) || (req.query && req.query.userId) || req.headers['x-userId'];
  var point = (req.params && req.params.point) || (req.body && req.body.point) || (req.query && req.query.point) || req.headers['x-point'];

  var userIP = (req.params && req.params.userIP) || (req.body && req.body.userIP) || (req.query && req.query.userIP) || req.headers['x-userIP'];
  // var userIP = utils.getUserIP(req);
  logger.debug('userIP ::: %j', userIP);

  if (!gk_key || !gk_secret || !mgId || !userId || !point) {
    var errorMessage = 'gk_key, gk_secret, mgId, userId, point required';
    logger.error(errorMessage);
    return callback(errorMessage);
  }

  let rtnValue = {
    success : '',
    error : {
      code : '',
      message : ''
    }
  };

  if (gk_key == 'gkpoint_key' && gk_secret == 'gkpoint_secret') {
    rtnValue.success = 'true';
  } else {
    rtnValue.success = 'false';
    rtnValue.error.code = 4001;
    rtnValue.error.message = '해당ID 존재하지 않음';
  }

  callback(null, rtnValue);
  logger.debug('---gkpoint END---');

  return;
}

module.exports = gkpoint;
