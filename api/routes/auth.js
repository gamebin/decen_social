var async = require('async');
var utils = require('../constants/utils');
var kikis = require('../constants/kikis');

var auth  = {

  login: function(req, res, next) {
    login(req, res, next);
  },

  logout: function(req, res, next) {
    logout(req, res, next);
  }

};

function login(req, res, next) {
  logger.debug('---auth.login START---');

  var appId       = (req.params && req.params.appId) || (req.body && req.body.appId) || (req.query && req.query.appId) || req.headers['appId'];
  var userId      = (req.params && req.params.userId) || (req.body && req.body.userId) || (req.query && req.query.userId) || req.headers['userId'];
  var loginType   = (req.params && req.params.loginType) || (req.body && req.body.loginType) || (req.query && req.query.loginType) || req.headers['loginType'];
  var userName    = (req.params && req.params.userName) || (req.body && req.body.userName) || (req.query && req.query.userName) || req.headers['userName'];

  var rtnValue    = (req.body && req.body.rtnValue);
  var secretKey   = rtnValue.secretKey;

  var userIP = (req.params && req.params.userIP) || (req.body && req.body.userIP) || (req.query && req.query.userIP) || req.headers['x-userIP'];
  // var userIP = utils.getUserIP(req);
  logger.debug('userIP ::: %j', userIP);
  logger.debug('appId ::: %j, secretKey ::: %j, userId ::: %j, userName ::: %j', appId, secretKey, userId, userName);

  if (!appId || !userId || !secretKey) {
    var errorMessage = 'appId, secretKey and userId required.';
    logger.error(errorMessage);
    return next(errorMessage);
  }

  if (!userName) userName = userId;

  logger.debug('<<<loginType:' + loginType);

  if (!loginType || loginType === '')
    loginType = 'A';

  var conn;

  async.waterfall(
  [
    function(callback) {
      if (!secretKey) {
        callback('Invalid appId (with no secretKey)');
        return;
      }

      let sequelize = utils.createConnection();
      const Application = sequelize.import('../models/application');

      Application.findOne({ where: { appId: appId } })
      .then(appInfo => {
        logger.debug('appInfo ::: %j', appInfo);
        if (appInfo == null) callback('Invalid appId.');
        else if (appInfo.dataValues.appSecret != secretKey) callback('Invalid secretKey.');
        else {
          callback(null);
          sequelize.close();
        }
      })
      .catch(err => {
        logger.error('appInfo.err ::: %j', err);
        callback(err);
        sequelize.close();
      });
    },

    function(callback) {

      let sequelize = utils.createConnection();
      const User = sequelize.import('../models/user');

      User.findOne({ where: { 'appId': appId, 'userId': userId } })
      .then(userInfo => {
        logger.debug('userInfo > %j', userInfo);
        if (userInfo != null)
          logger.debug('userInfo.dataValues.userName > %j userName > %j', userInfo.dataValues.userName, userName);
        if (userInfo == null || userInfo.dataValues == null) {
          var err = register(req, res);
          if (err) { conn.end(); return callback(err); }
        } else if (userInfo.dataValues.userName != userName) {
          logger.debug('point here!!!');
          return User.update({ 'userName': userName }, { where: { 'appId': appId, 'userId': userId } })
          .then(updatedUserInfo => {
            logger.debug('updatedUserInfo > %j', updatedUserInfo);
            callback(null, secretKey);
            sequelize.close();
          })
        }

        callback(null, secretKey);
        sequelize.close();
      })
      .catch(err => {
        logger.error('userInfo.err ::: %j', err);
        callback(err);
        sequelize.close();
      });
    },

    function(secretKey, callback) {
      let kikiOpts = {};
      kikiOpts.appId = appId;
      kikiOpts.userId = userId;
      kikiOpts.secretKey = secretKey;
      kikiOpts.loginType = loginType;
      kikiOpts.userIP = userIP;

      kikis.genToken(kikiOpts, function (err, results) {
        if (err) callback(err);
        else callback(null, results);
      });
    }
  ],

    function (err, token) {
      logger.debug('---auth.login END---');
      if(err) {
          logger.error('err>>>'+err);
          res.status(500);
          res.json({
              "message": "Oops something went wrong",
              "error": err
          });

          return;
      }

      res.status(200);
      res.json({
        'message' : 'succeed to login.',
        "token"   : token
      });

      return;
    }

  ); // end waterfall
}

function logout(req, res, next) {
  logger.debug('---auth.logout START---');

  var appId     = (req.params && req.params.appId) || (req.body && req.body.appId) || (req.query && req.query.appId) || req.headers['appId'];
  var userId    = (req.params && req.params.userId) || (req.body && req.body.userId) || (req.query && req.query.userId) || req.headers['userId'];

  var rtnValue  = (req.body && req.body.rtnValue);
  var secretKey = rtnValue.secretKey;
  var token     = rtnValue.token;

  if (!appId || !userId) {
    errorMessage = 'appId, userId required';
    logger.error(errorMessage);
    return next(errorMessage);
  }

  var conn;

  async.waterfall(
  [
    function(callback) {

      var getUserToken = 'SELECT loginToken, expiredYN, loginDate FROM user_loginlog WHERE expiredYN=\'N\' AND userId=? AND appId=? ORDER BY logindate DESC';

      conn = createConnection();

      conn.query(getUserToken, [userId, appId], function(err, results) {
        if (err) {
          conn.end();
          return callback(err);
        }

        if (results.length > 0) {
          rtnValue.token     = results[0].loginToken;
          rtnValue.expiredYN = results[0].expiredYN;

          callback(null, rtnValue);
        } else {
          callback('Token does not existed.');
        }

        conn.end();
      });
    },

    function(rtnValue, callback) {
      if (rtnValue.token) {
        let kikiOpts = {};
        kikiOpts.token = rtnValue.token;
        kikis.endToken(kikiOpts, function(err, results) {
          if (err) callback(err);
          else callback(null, rtnValue);
        });
      } else {
        callback(null, rtnValue);
      }
    }
  ],

    function(err, rtnValue) {
      logger.debug('---auth.logout END---');

      if(err) {
        logger.error('logout err >>> %j', err);
        res.status(500);
        res.json({
          "message" : "Oops something went wrong.",
          "error"   : err
        });

        return;
      }

      res.status(200);
      res.json({
        'message' : 'succeed to logout.'
      });

      return;

    }
  ); // end async.waterfall();
}

function register(req, res) {
  logger.debug('---auth.register START---');
  var appId     = (req.body && req.body.appId) || req.headers['appId'];
  var userId    = (req.body && req.body.userId) || req.headers['userId'];
  var joinRoute = (req.body && req.body.loginType) || req.headers['loginType'];
  var userName  = (req.body && req.body.userName) || req.headers['userName'];

  var userIP = utils.getUserIP(req);
  logger.debug('userIP ::: %j', userIP);

  var conn;

  logger.debug('<<<joinRoute:' + joinRoute);

  if (!joinRoute || joinRoute === '')
    joinRoute = 'A';

  let kikiOpts = {};
  kikiOpts.userId = userId;
  kikiOpts.appId = appId;
  kikiOpts.joinRoute = joinRoute;
  kikiOpts.userIP = userIP;
  if (!userName)
    userName = userId;
  kikiOpts.userName = userName;

  kikis.genUser(kikiOpts, function (err, results) {
    if (err) return err;
  });

  logger.debug('---auth.register END---');

  return;
}

function createConnection() {
  // var mysql = require('mysql');

  // return mysql.createConnection(config.mysql_live);

  return utils.createOldConnection();
}

module.exports = auth;