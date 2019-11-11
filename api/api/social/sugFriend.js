/**
 * sugFriend : suggested friends list
 * Created by stub on 2016-03-14.
 */

var utils = require('../../constants/utils');

var sugFriend = {
  execute : function(req, res, callback) {
    return execute(req, res, callback);
  }
};

function execute(req, res, callback) {
  logger.debug('---sugFriend START---');

  var appId   = (req.params && req.params.appId) || (req.body && req.body.appId) || (req.query && req.query.appId) || req.headers['x-appId'];
  var userId  = (req.params && req.params.userId) || (req.body && req.body.userId) || (req.query && req.query.userId) || req.headers['userId'];

  logger.debug('appId ::: %s, userId ::: %s', appId, userId);

  var conn = utils.createOldConnection();

  var getSuggestFriendsList =  'SELECT '
    + '    a.UserId, '
    + '    Username, '
    + '    userPoint, '
    // + '    GROUP_CONCAT( badgeimg ) AS badgeimg, '
    + '    userImg, '
    + '    (select ranking from leaderboard where a.appId = appId and a.userId = UserId) as ranking, '
    + '    (select levelId from applevel where appId = ? and a.UserPoint >= minPoint and a.Userpoint <  maxPoint) as levelId '
    + 'FROM '
    // + '    user a left join user_badges b on a. UserId = b. UserId left join AppBadges c on b.badgeId = c.badgeId '
    + '    user a '
    + '    inner join user_record d on a.UserID = d.UserId and a.appId = d.appId '
    + 'WHERE '
    + '    a.appid=? and targetId IN ( select * from ( select targetid from user_record where appid = ? '
    + '    and userid = ? and targetid <> \'NA\' order by rand() limit 0, 20) as tmp  ) and a.userid <> ? '
    + '    group by a.userid '
    + '    order by rand() '
    + '    limit 0,20';

  logger.debug('[sugFriend] getSuggestFriendsList : ' + getSuggestFriendsList);

  conn.query(getSuggestFriendsList, [appId, appId, appId, userId, userId] , function(err, results) {
    if (err) {
      logger.error(err);
      conn.end();
      return callback(err);
    }

    callback(null, results);

    conn.end();
  });

  logger.debug('---sugFriend END---');
}

module.exports = sugFriend;