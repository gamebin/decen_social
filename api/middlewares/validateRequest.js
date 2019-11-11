/**
 * validateRequest.js
 **/
"use strict";

var async = require('async');

var jwt   = require('jwt-simple');
var utils = require('../constants/utils');
var kikis = require('../constants/kikis');

module.exports = function (req, res, next) {

  logger.debug('---validateRequest START---');

  var token       = (req.params && req.params.token) || (req.body && req.body.token) || (req.query && req.query.token) || req.headers['x-auth-token'];
  var appId       = (req.params && req.params.appId) || (req.body && req.body.appId) || (req.query && req.query.appId) || req.headers['appId'];
  var secretKey   = (req.params && req.params.secretKey) || (req.body && req.body.secretKey) || (req.query && req.query.secretKey) || req.headers['secretKey'];
  var userId      = (req.params && req.params.userId) || (req.body && req.body.userId) || (req.query && req.query.userId) || req.headers['userId'];
  var loggedInYN  = (req.params && req.params.loggedInYN) || (req.body && req.body.loggedInYN) || (req.query && req.query.loggedInYN) || req.headers['loggedInYN'];

  var pageNo      = (req.params && req.params.pageNo) || (req.body && req.body.pageNo) || (req.query && req.query.pageNo) || req.headers['pageNo'];
  var pageSize    = (req.params && req.params.pageSize) || (req.body && req.body.pageSize) || (req.query && req.query.pageSize) || req.headers['x-pageSize'];

  logger.info('req.url>>>%j, appId>>>%j, userId>>>%j, loggedInYN>>>%j', req.url, appId, userId, loggedInYN);

  if (!pageNo || pageNo === '' || pageNo === '0') {
    pageNo = 1;
  }

  req.body.pageNo = pageNo;
  req.query.pageNo  = pageNo;

  var userIP = utils.getUserIP(req);
  req.body.userIP = userIP;
  req.query.userIP  = userIP;

  if(!pageSize) {
    req.body.pageSize = 20;
    req.query.pageSize  = 20;
  } else {
    req.body.pageSize = parseInt(pageSize);
    req.query.pageSize  = parseInt(pageSize);
  }

  if (req.url.lastIndexOf('/login', 0) === 0 && !userId) {
    var errorMessage = 'userId required.';
    logger.error(errorMessage);
    return next(errorMessage);
  }

  if (req.url.lastIndexOf('/feed') > 0 || 
      req.url.lastIndexOf('/toplist') > 0 ||
      req.url.lastIndexOf('/userLevel') > 0 ||
      req.url.lastIndexOf('/getCafe24Token', 0) === 0) { 
    loggedInYN = 'N'; 
    req.body.loggedInYN = 'N';
    req.query.loggedInYN = 'N';
    return next();
  } else if (loggedInYN === 'N') return next('user log in required.');

  if (!appId || !userId) {
    var errorMessage = 'appId and userId required.';
    logger.error(errorMessage);
    return next(errorMessage);
  }

  if (!token && (req.url.lastIndexOf('/dummy', 0) === 0)) {
    var errorMessage = 'token required';
    logger.error(errorMessage);
    return next(errorMessage);
  }

  var rtnValue = {};
  rtnValue.appId = appId;
  rtnValue.userId = userId;
  rtnValue.secretKey = secretKey;
  rtnValue.updatedToken = 'N';

  const sequelize = utils.createConnection();

  async.waterfall(
    [
      function (callback) {
        if (req.url.lastIndexOf('/login',   0) === 0) callback(null, rtnValue);
        else {
          let Application = sequelize.import('../models/application');
          Application.findAll({
            attributes: [
              'appSecret'
            ],
            where: { appId: appId }
          })
          .then(appInfo => {
            if (!appInfo || appInfo.length < 1 || !appInfo[0].appSecret) {
              var errorMessage = 'Invalid appId(with no secretKey)';
              logger.error(errorMessage);
              return callback(errorMessage);
            } else {
              var secretKey = appInfo[0].appSecret;

              rtnValue.secretKey    = secretKey;
              rtnValue.token        = token;

              logger.debug('rtnValue.secretKey >>> '  + rtnValue.secretKey);
              logger.debug('rtnValue.token >>> '      + rtnValue.token);

              callback(null, rtnValue);
            }
          })
          .catch(err => {
            logger.error(err);
            return callback(err);
          });
        }
      },

      function (rtnValue, callback) {
        if (token) {
          var decoded;
          try {
            decoded = jwt.decode(rtnValue.token, rtnValue.secretKey);
          } catch (err) {
            var errorMessage = 'Token is not valid. check your token.';
            logger.error(errorMessage);
            callback(errorMessage);
            return;
          }

          if (!userId) userId = decoded.userId;

          logger.debug('decoded.exp >>> ' + decoded.exp);
          logger.debug('Date.now() >>> ' + Date.now());

          if (decoded.appId != appId) {
            var errorMessage = 'Invalid appId with input token';
            logger.error(errorMessage);
            return callback(errorMessage);
          }

          if (decoded.userId != userId) {
            var errorMessage = 'Invalid userId with input token';
            logger.error(errorMessage);
            return callback(errorMessage);
          }

          if (decoded.exp <= Date.now()) {
            rtnValue.updatedToken = 'Y';
            
            let kikiOpts = {};
            kikiOpts.token = token;
            kikiOpts.userId = userId;
            kikiOpts.secretKey = rtnValue.secretKey;
            kikiOpts.appId = appId;

            kikis.endToken(kikiOpts, function(err, results) {
              if (err) callback(err);
              else {
                logger.debug('kikis.endToken.results ::: %j', results);
                kikiOpts.loginType = results.dataValues.loginType;
                kikiOpts.userIp = results.dataValues.UserIp;

                logger.debug('validateRequest.kikis.endToken.kikiOpts ::: %j', kikiOpts);
                kikis.genToken(kikiOpts, function(err, results) {
                  if (err) callback(err);
                  else {
                    logger.debug('kikis.genToken.results ::: %j', results);
                    rtnValue.appId  = decoded.appId;
                    rtnValue.userId = decoded.userId;

                    callback(null, rtnValue);
                  }
                });
              }
            });
          } else {
            rtnValue.appId  = decoded.appId;
            rtnValue.userId = decoded.userId;
            callback(null, rtnValue);
          }
        } else {
          callback(null, rtnValue);
        }
      },

      function (rtnValue, callback) {
        if (token) {
          let UserLoginlog = sequelize.import('../models/user_loginlog');
          UserLoginlog.findOne({
            attributes: [
              'loginToken','expiredYN','logindate'
            ],
            where: { expiredYN: 'N', userId: userId, appId: appId },
            order: [['logindate', 'DESC']]
          })
          .then(userLogin => {
            if (userLogin) {
              rtnValue.token     = userLogin.loginToken;
              rtnValue.expiredYN = userLogin.expiredYN;
              callback(null, rtnValue);
            } else {
              var errorMessage = 'Token is not valid. check your token.';
              logger.error(errorMessage);
              return callback(errorMessage);
            }
          })
          .catch(err => {
            logger.error('getToken >>> error');
            logger.error(err);
            return callback(err);
          });
        } else {
          callback(null, rtnValue);
        }
      }

    ],

    function (err, rtnValue) {
      if (err) return next(err);

      req.body.rtnValue = rtnValue;

      logger.debug('rtnValue.token >>> %j', rtnValue.token);

      logger.debug('---validateToken END---');
      sequelize.close();

      checkExceptionURL(rtnValue.token, function (err, result) {
        logger.debug(result);
        if (result === 'false') {
          logger.error('token required.');

          return next('token required.');
        } else if (result === 'dummy') {
          res.status(200);
          res.json({
            updatedToken  : req.body.rtnValue.updatedToken,
            token   : req.body.rtnValue.token,
            result  : 'ok'
          });
        } else {
          return next();
        }
      });
    }
  ); // end async.waterfall();

  function checkExceptionURL(token, callback) {
    var result = 'false';

    if (req.url.lastIndexOf('/dummy',   0) === 0) result = 'dummy';
    else if (token) result = 'true';
    else if (!token && (req.url.lastIndexOf('/login',   0) === 0)) result = 'true';
    else if (!token && (req.url.lastIndexOf('/logout',  0) === 0)) result = 'true';

    // logger.debug('result >>> %j', result);
    callback(null, result);
  }

};

