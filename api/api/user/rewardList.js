/**
 * rewardList : get reward information list
 * Created by stub on 2016-03-14.
 */

var utils = require('../../constants/utils');

var rewardList = {
  execute : function(req, res, callback) {
    return execute(req, res, callback);
  }
};

function execute(req, res, callback) {
  logger.debug('---rewardList START---');

  var appId   = (req.params && req.params.appId) || (req.body && req.body.appId) || (req.query && req.query.appId) || req.headers['x-appId'];

  if (!appId) {
    var errorMessage = 'appId required';
    logger.error(errorMessage);
    return callback(errorMessage);
  }

  var conn = utils.createOldConnection();

  var getRewardList = 'SELECT actName, actDesc, rewKind, rewardValue, restricted, badgeImg ';
  getRewardList += 'FROM activity a LEFT JOIN activity_reward b ON a.actId = b.actId ';
  getRewardList += 'LEFT JOIN appbadges c ON b.rewardValue = c.badgeId ';
  getRewardList += 'WHERE a.appId=\'' + appId + '\' ';
  getRewardList += 'ORDER BY rewKind DESC, a.regiYHS ASC ';

  conn.query(getRewardList, function(err, results) {
    if (err) {
      logger.error(err);
      conn.end();
      return callback(err);
    }

    callback(null, results);

    conn.end();

  });

  logger.debug('---rewardList END---');
}

module.exports = rewardList;