/**
 * profile : get user profile
 * Created by stub on 2016-03-14.
 */

var async       = require('async');
var utils = require('../../constants/utils');

var profile = {
  execute : function(req, res, callback) {
    return execute(req, res, callback);
  }
};

function execute(req, res, callback) {
  logger.debug('---profile START---');

  var appId         = (req.params && req.params.appId) || (req.body && req.body.appId) || (req.query && req.query.appId) || req.headers['x-appId'];
  var userId        = (req.params && req.params.userId) || (req.body && req.body.userId) || (req.query && req.query.userId) || req.headers['x-userId'];
  var targetUserId  = (req.params && req.params.targetUserId) || (req.body && req.body.targetUserId) || (req.query && req.query.targetUserId) || req.headers['x-targetUserId'];
  logger.debug('appId : %j, userId : %j, targetUserId : %j', appId, userId, targetUserId);

  if (!appId || !userId) {
    var errorMessage = 'appId and userId required.';
    logger.error(errorMessage);
    return callback(errorMessage);
  }

  var getUserProfile = 'SELECT ';
  getUserProfile += '  distinct a.userId as userId, userName as userName, userPoint, ';
  getUserProfile += '  ( SELECT levelId FROM appLevel WHERE appId   = ?  AND  a.UserPoint >= minPoint AND a.Userpoint < maxPoint ) as levelId, ';
  getUserProfile += '  ( SELECT minpoint FROM appLevel WHERE appId  = ?  AND  a.UserPoint >= minPoint AND a.Userpoint < maxPoint ) as minPoint , ';
  getUserProfile += '  ( SELECT minpoint FROM appLevel WHERE appId  = ?  AND  a.UserPoint < minPoint ORDER BY minpoint limit 1 ) as nextminPoint, ';
  getUserProfile += '  userImg, ';
  getUserProfile += '  ( SELECT ranking FROM leaderboard WHERE a.appId = appId AND a.userId = userId order by ranking limit 1 ) as ranking, ';
  getUserProfile += '  ( SELECT count(achiSerno) FROM achievement WHERE appId = a.appId ) AS achiCnt, ';
  getUserProfile += '  ( SELECT count(achiUserSerno) FROM achievement_user_comp WHERE appId = a.appId AND userId = a.userId ) AS compachiCnt '
  getUserProfile += 'FROM ';
  getUserProfile += '  user a left join user_badges b on a. UserId = b. UserId left join AppBadges c on b.badgeId = c.badgeId ';
  // getUserProfile += '  inner join achievement d on a.appId = d.appId left join achievement_user_comp e ON a.appId = e.appId and a.userId = e.userId ';
  getUserProfile += 'WHERE ';
  if (targetUserId)
    getUserProfile += '  a.userId = \'' + targetUserId + '\' AND a.appId = ? ';
  else
    getUserProfile += '  a.userId = \'' + userId + '\' AND a.appId = ? ';

  logger.debug('getUserProfile : %j', getUserProfile);

  var getUserBadgeInfo = 'SELECT a.userId, badgename, badgeimg, developerId ';
  getUserBadgeInfo += 'FROM ';
  getUserBadgeInfo += '  user a LEFT JOIN user_badges b ON a.userid = b.userid AND a.appId = b.appId ';
  getUserBadgeInfo += '  INNER JOIN appbadges c ON b.badgeid = c.badgeid AND a.appId = c.appId ';
  if (targetUserId)
    getUserBadgeInfo += 'WHERE a.userId = \'' + targetUserId + '\' AND a.appId = \'' + appId + '\' ';
  else
    getUserBadgeInfo += 'WHERE  a.userId = \'' + userId + '\' AND a.appId = \'' + appId + '\' ';

  logger.debug('getUserBadgeInfo : %j', getUserBadgeInfo);

  var getFriendsCount = 'SELECT count(DISTINCT a.userId) as count ';
  getFriendsCount += 'FROM ';
  getFriendsCount += '    user a left join user_badges b on a. UserId = b. UserId left join AppBadges c on b.badgeId = c.badgeId ';
  getFriendsCount += '    inner join friend d on a.UserID = d.friendUserId and a.appId = d.appId ';
  getFriendsCount += 'WHERE ';
  if (targetUserId)
    getFriendsCount += '    a.appid=? and (friendStusDstcd = \'R2\' or friendStusDstcd = \'A2\') and d.userid = \'' + targetUserId + '\' AND d.friendUserId <> \'' + targetUserId + '\'';
  else
    getFriendsCount += '    a.appid=? and (friendStusDstcd = \'R2\' or friendStusDstcd = \'A2\') and d.userid = \'' + userId + '\' AND d.friendUserId <> \'' + userId + '\'';

  logger.debug('getFriendsCount : %j', getFriendsCount);

  var connection = utils.createOldConnection();

  async.waterfall(
    [
      // 01. 사용자 profile 조회
      function (callback) {
        connection.query(getUserProfile, [appId, appId, appId, appId], function (err, results) {
          if (err) { callback(err); return; }
          if (results != null && results.length < 1) {
            var errorMessage = 'userId does not exist.';
            logger.error(errorMessage);
            return callback(errorMessage);
          }
          logger.debug('[profile] 사용자 profile 조회 >>> %j', results);
          callback(null, results);
        });
      },

      // 02. 사용자 badge 정보 조회
      function (userProfile, callback) {
        connection.query(getUserBadgeInfo, function (err, results) {
          if (err) { callback(err); return; }
          logger.debug('[profile] 사용자 badge 정보 조회 >>> %j', results);
          callback(null, userProfile, results);
        });
      },

      // 03. 사용자 친구 숫자 조회
      function (userProfile, badgeInfo, callback) {
        connection.query(getFriendsCount, appId, function (err, results) {
          if (err) { callback(err); return; }

          callback(null, userProfile, badgeInfo, results[0].count);
        });
      }
    ],

    function (err, userProfile, badgeInfo, friendsCount) {
      if (err) {
        endConnection(err);
        callback(err);
        return;
      } else {
        var badgeInfoJ = [];

        badgeInfo.forEach(function(row, i) {
          var badgeName = '', badgeImg = '', developerId = '';
          badgeName   = badgeInfo[i].badgename;
          badgeImg    = badgeInfo[i].badgeimg;
          developerId = badgeInfo[i].developerId;

          badgeInfoJ.push(badgeName + ',' + badgeImg + ',' + developerId);
        });

        var userProfileJ = {
          'userId'        : userProfile[0].userId,
          'userName'      : userProfile[0].userName,
          'userPoint'     : userProfile[0].userPoint,
          'levelId'       : userProfile[0].levelId,
          'minPoint'      : userProfile[0].minPoint,
          'nextminPoint'  : userProfile[0].nextminPoint,
          'userImg'       : userProfile[0].userImg,
          'ranking'       : userProfile[0].ranking,
          'achiCnt'       : userProfile[0].achiCnt,
          'compachiCnt'   : userProfile[0].compachiCnt,
          'badgeInfo'     : badgeInfoJ,
          'friendsCount'  : friendsCount
        };

        // setTimeout(function() {
          callback(null, userProfileJ);
          logger.debug('---profile END---');

          endConnection();
          return;
        // }, 1);
      }
    }
  ); // end waterfall

  function endConnection(err) {
    if (err) {
      logger.error(err);
      connection.end(
        function (err) {
          if (!err)connection = null;
          else logger.debug(err)
        }
      );

    } else {
      connection.end(function () {
        logger.debug('connection closed');
      });
    }
  }
}

module.exports = profile;