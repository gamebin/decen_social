/**
 * userLevel : get a user level information
 * Created by stub on 2017-08-17.
 */

var utils = require('../../constants/utils');

var userLevel = {
  execute : function(req, res, callback) {
    return execute(req, res, callback);
  }
};

function execute(req, res, callback) {
  logger.debug('---userLevel START---');

  var appId         = (req.params && req.params.appId) || (req.body && req.body.appId) || (req.query && req.query.appId) || req.headers['x-appId'];
  var userId        = (req.params && req.params.userId) || (req.body && req.body.userId) || (req.query && req.query.userId) || req.headers['userId'];
  var targetUserId  = (req.params && req.params.targetUserId) || (req.body && req.body.targetUserId) || (req.query && req.query.targetUserId) || req.headers['targetUserId'];

  if(!appId || !targetUserId) { var errorMessage = 'appId and targetUserId required.'; logger.error(errorMessage); return callback(errorMessage); }

  logger.debug('appId : %j, targetUserId : %j', appId, targetUserId);

  var conn = utils.createOldConnection();

  var getUserLevel  = 'SELECT ';
      getUserLevel += '   userId, userName, userPoint, ';
      getUserLevel += '   ( SELECT levelId FROM appLevel WHERE appId=\'' + appId + '\' AND UserPoint >= minPoint AND Userpoint < maxPoint ) as levelId ';
      getUserLevel += 'FROM ';
      getUserLevel += '   user ';
      getUserLevel += 'WHERE ';
      getUserLevel += '   userId = \'' + targetUserId + '\' AND appId = \'' + appId + '\' ';

  logger.debug('getUserLevel : %j', getUserLevel);

  conn.query(getUserLevel, function(err, results) {
    if (err) {
      logger.error(err);
      conn.end();
      return callback(err);
    }

    callback(null, results);

    conn.end();
  });

  logger.debug('---userLevel END---');
}

module.exports = userLevel;