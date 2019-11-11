/**
 * reqFirendList : 친구 요청 받은 리스트 조회
 * Created by stub on 2016-03-14.
 */
var utils = require('../../constants/utils');

var reqFirendList = {
  execute : function(req, res, callback) {
    return execute(req, res, callback);
  }
};

function execute(req, res, callback) {
  logger.debug('---reqFirendList START---');

  var appId   = (req.params && req.params.appId) || (req.body && req.body.appId) || (req.query && req.query.appId) || req.headers['x-appId'];
  var userId  = (req.params && req.params.userId) || (req.body && req.body.userId) || (req.query && req.query.userId) || req.headers['userId'];

  logger.debug('appId ::: %s, userId ::: %s', appId, userId);

  var conn = utils.createOldConnection();

  var getReqFriendList = 'SELECT '
    + '   a.userId, '
    + '   Username, '
    + '   userPoint, '
    + '   GROUP_CONCAT( badgeimg ) AS badgeimg, '
    + '   userImg, '
    + '   (select ranking from leaderboard where a.appId = appId and a.userId = UserId) as ranking, '
    + '   (select levelId from applevel where appId = ? and a.UserPoint >= minPoint and a.Userpoint <  maxPoint  ) levelId '
    + 'FROM '
    + '   user a left join user_badges b on a.userId = b.UserId left join AppBadges c on b.badgeId = c.badgeId '
    + '   inner join message d on a.UserID = d.userid and a.appId = d.appId '
    + 'WHERE '
    + '   a.appid=? and sendRecvDstcd = \'SF\' and readStusDstcd <> \'03\' and receiverId=? '
    + '   group by d.userid order by d.regiYHS;';

  conn.query(getReqFriendList, [appId, appId, userId], function(err, results) {
    if (err) {
      logger.error(err);
      conn.end();
      return callback(err);
    }

    callback(null, results);

    conn.end();

  });

  logger.debug('---reqFirendList END---');
}

module.exports = reqFirendList;