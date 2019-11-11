/**
 * friendList : get friends list
 * Created by stub on 2016-03-14.
 */

var utils = require('../../constants/utils');

var friendList = {
  execute : function(req, res, callback) {
    return execute(req, res, callback);
  }
};

function execute(req, res, callback) {
  logger.debug('---friendList START---');

  var appId         = (req.params && req.params.appId) || (req.body && req.body.appId) || (req.query && req.query.appId) || req.headers['x-appId'];
  var userId        = (req.params && req.params.userId) || (req.body && req.body.userId) || (req.query && req.query.userId) || req.headers['userId'];
  var targetUserId  = (req.params && req.params.targetUserId) || (req.body && req.body.targetUserId) || (req.query && req.query.targetUserId) || req.headers['x-targetUserId'];

  logger.debug('appId : %j, userId : %j, targetUserId : %j', appId, userId, targetUserId);

  var conn = utils.createOldConnection();

  var getFriendsList = 'SELECT ';
    getFriendsList += '		a.UserId, ';
    getFriendsList += '		Username, ';
    getFriendsList += '		userPoint, ';
    //getFriendsList += '		GROUP_CONCAT( badgeimg  ) AS badgeimg, ';
    getFriendsList += '		userImg, ';
    getFriendsList += '		(select ranking from leaderboard where a.appId = appId and a.userId = userId) as ranking, ';
    getFriendsList += '   (select levelId from applevel where appId = ? and a.UserPoint >= minPoint and a.Userpoint <  maxPoint  ) levelId ';
    getFriendsList += 'FROM ';
    getFriendsList += '		user a left join user_badges b on a. UserId = b. UserId left join AppBadges c on b.badgeId = c.badgeId ';
    getFriendsList += '		inner join friend d on a.UserID = d.friendUserId and a.appId = d.appId ';
    getFriendsList += 'WHERE ';
  if(targetUserId)
    getFriendsList += '		a.appId = ? and (friendStusDstcd = \'R2\' or friendStusDstcd = \'A2\') and d.userid = \'' + targetUserId + '\' AND d.friendUserId <> \'' + targetUserId + '\'';
  else
    getFriendsList += '		a.appId = ? and (friendStusDstcd = \'R2\' or friendStusDstcd = \'A2\') and d.userid = \'' + userId + '\' AND d.friendUserId <> \'' + userId + '\'';
    getFriendsList += '		group by a.userid order by d.applystartYmd';

  logger.debug('getFriendsList : %j', getFriendsList);

  conn.query(getFriendsList, [appId, appId] , function(err, results) {
    if (err) {
      logger.error(err);
      conn.end();
      return callback(err);
    }

    callback(null, results);

    conn.end();
  });

  logger.debug('---friendList END---');
}

module.exports = friendList;