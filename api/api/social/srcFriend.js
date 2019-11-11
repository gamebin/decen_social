/**
 * srcFriend : search new friends with keyword
 * Created by stub on 2016-03-14.
 */

var utils = require('../../constants/utils');

var srcFriend = {
  execute : function(req, res, callback) {
    return execute(req, res, callback);
  }
};

function execute(req, res, callback) {
  logger.debug('---srcFriend START---');

  var appId   = (req.params && req.params.appId) || (req.body && req.body.appId) || (req.query && req.query.appId) || req.headers['x-appId'];
  var userId  = (req.params && req.params.userId) || (req.body && req.body.userId) || (req.query && req.query.userId) || req.headers['userId'];
  var kWord   = (req.params && req.params.kWord) || (req.body && req.body.kWord) || (req.query && req.query.kWord) || req.headers['x-kWord'];

  if (!kWord) {
    var errorMessage = 'kWord required';
    logger.error(errorMessage);
    return callback(errorMessage);
  }
  logger.debug('appId ::: %s, userId ::: %s, kWord ::: %s', appId, userId, kWord);

  var conn = utils.createOldConnection();

  var searchFriend = '';
  searchFriend += 'SELECT ';
  searchFriend += ' a.userId, Username, userPoint, ';
  searchFriend += ' GROUP_CONCAT(badgeimg) AS badgeimg, userImg, ';
  searchFriend += ' (select ranking from leaderboard where a.appId = appId and a.userId = UserId) as ranking, ';
  searchFriend += ' (select levelId from applevel where appId = ? and a.UserPoint >= minPoint and a.Userpoint <  maxPoint) levelId, ';
  searchFriend += ' (select distinct frienduserid from friend where userId = ? and a.userId = frienduserid and appId=? and frienduserid <> ?) as friendFlag ';
  searchFriend += 'FROM ';
  searchFriend += ' user a left join user_badges b on a.userId = b.userId left join AppBadges c on b.badgeId = c.badgeId ';
  searchFriend += 'WHERE ';
  searchFriend += ' a.appId=? and (a.username like ?) and a.userId <> ? ';
  searchFriend += ' group by a.userId';

  logger.debug('searchFriend : %j', searchFriend);

  conn.query(searchFriend, [appId, userId, appId, userId, appId, kWord+'%', userId], function(err, results) {
    if (err) {
      logger.error(err);
      conn.end();
      return callback(err);
    }

    callback(null, results);

    conn.end();

  });

  logger.debug('---srcFriend END---');
}

module.exports = srcFriend;