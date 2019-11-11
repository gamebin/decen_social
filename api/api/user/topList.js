/**
 * topList : search ranking list
 * Created by stub on 2016-03-14.
 */

var async = require('async');
var utils = require('../../constants/utils');

var topList = {
  execute : function(req, res, callback) {
    return execute(req, res, callback);
  }
};

function execute(req, res, callback) {
  logger.debug('---topList START---');

  var appId     = (req.params && req.params.appId) || (req.body && req.body.appId) || (req.query && req.query.appId) || req.headers['x-appId'];
  var userId    = (req.params && req.params.userId) || (req.body && req.body.userId) || (req.query && req.query.userId) || req.headers['x-userId'];
  var isFriend  = (req.params && req.params.isFriend) || (req.body && req.body.isFriend) || (req.query && req.query.isFriend) || req.headers['x-isFriend'];
  var pageNo    = (req.params && req.params.pageNo) || (req.body && req.body.pageNo) || (req.query && req.query.pageNo) || req.headers['x-pageNo'];
  var pageSize  = (req.params && req.params.pageSize) || (req.body && req.body.pageSize) || (req.query && req.query.pageSize) || req.headers['x-pageSize'];
  var isLast    = 'false';

  if (!userId)
    userId = '';
  
  logger.debug('appId : %j, userId : %j, isFriend : %j', appId, userId, isFriend);
  logger.debug('pageNo : %j, pageSize : %j', pageNo, pageSize);

  var connection = utils.createOldConnection();

  var getMyRanking = 'SELECT ranking, a.userId, username, userImg, a.UserPoint, ';
  getMyRanking += '  ( SELECT levelId FROM appLevel WHERE appId = \'' + appId + '\' AND a.UserPoint >= minPoint AND b.Userpoint <= maxPoint ) as levelId ';
  getMyRanking += 'FROM ';
  getMyRanking += '   leaderboard a INNER JOIN user b ON a.userId = b.userId AND a.appId = b.appId ';
  getMyRanking += 'WHERE ';
  getMyRanking += '   a.userId = \'' + userId + '\' AND a.appId = \'' + appId + '\' ';

  logger.debug('getMyRanking : %j', getMyRanking);

  var getTopListCnt = '';
  if (isFriend == 'Y') {
    getTopListCnt += 'SELECT count(ranking) as count ';
    getTopListCnt += 'FROM ';
    getTopListCnt += '  leaderboard a inner join user b on a.userId = b.userId and a.appId = b.appId ';
    getTopListCnt += '  INNER JOIN friend d ON a.userId = d.friendUserId AND a.appId = d.appId ';
    getTopListCnt += 'WHERE ';
    getTopListCnt += '  b.appId = \'' + appId + '\' AND (friendStusDstcd = \'R2\' or friendStusDstcd = \'A2\') ';
    getTopListCnt += '  AND d.userId = \'' + userId + '\' ';
    getTopListCnt += 'ORDER BY ranking ';
  } else {
    getTopListCnt += 'SELECT count(ranking) as count ';
    getTopListCnt += 'FROM ';
    getTopListCnt += '  leaderboard a inner join user b on a.userId = b.userId and a.appId = b.appId ';
    getTopListCnt += 'WHERE ';
    getTopListCnt += '  a.appId = \'' + appId + '\' ';
    getTopListCnt += 'ORDER BY ranking ';
  }

  logger.debug('getTopListCnt : %j', getTopListCnt);

  var getTopList = '';
  if (isFriend == 'Y') {
    getTopList += 'SELECT ranking, a.userId, username, userImg, a.UserPoint, ';
    getTopList += '  ( SELECT levelId FROM appLevel WHERE appId = \'' + appId + '\' AND a.UserPoint >= minPoint AND b.Userpoint <= maxPoint ) as levelId ';
    getTopList += 'FROM ';
    getTopList += '  leaderboard a inner join user b on a.userId = b.userId and a.appId = b.appId ';
    getTopList += '  INNER JOIN friend d ON a.userId = d.friendUserId AND a.appId = d.appId ';
    getTopList += 'WHERE ';
    getTopList += '  b.appId = \'' + appId + '\' AND (friendStusDstcd = \'R2\' or friendStusDstcd = \'A2\') ';
    getTopList += '  AND d.userId = \'' + userId + '\' AND d.friendUserId <> \'' + userId + '\'';
    getTopList += 'ORDER BY ranking ';
  } else {
    getTopList += 'SELECT ranking, a.userId, username, userImg, a.UserPoint, ';
    getTopList += '  ( SELECT levelId FROM appLevel WHERE appId = \'' + appId + '\' AND a.UserPoint >= minPoint AND b.Userpoint <= maxPoint ) as levelId ';
    // getTopList += '       (select distinct friendUserId from friend where userId = \'' + userId + '\' and a.userId = friendUserId and ';
    // getTopList += '           appId = \'' + appId + '\' and friendUserId <> \'' + userId + '\') as friendFlag ';
    getTopList += 'FROM ';
    getTopList += '   leaderboard a inner join user b on a.userId = b.userId and a.appId = b.appId ';
    getTopList += 'WHERE ';
    // getTopList += '   a.appId = \'' + appId + '\' group by b.userId order by ranking limit ?, ? ';
    getTopList += '   a.appId = \'' + appId + '\' order by ranking limit ?, ? ';  }

  logger.debug('getTopList : %j', getTopList);

  async.waterfall(
    [
      // 00. 자신의 순위 조회
      function (callback) {
        connection.query(getMyRanking, function (err, results) {
          if (err) { callback(err); return; }
          callback(null, results);
        });
      },

      // 01. 랭킹 총 카운트 조회
      function (myRankInfo, callback) {
        connection.query(getTopListCnt, function (err, results) {
          if (err) { callback(err); return; }
          logger.debug('[topList] 랭킹 총 카운트 조회 >>> %j', results);
          callback(null, myRankInfo, results);
        });
      },

      // 02. 랭킹 리스트 조회
      function (myRankInfo, rankCnt, callback) {
        logger.debug('[topList] rankCnt[0].count = %j, pageNo = %j, pageSize = %j', rankCnt[0].count, pageNo, pageSize);
        if (rankCnt[0].count < pageNo*pageSize) {
          isLast = 'true';
        }
        var startNum = (pageNo-1)*pageSize;
        logger.debug('[topList] startNum = %j, pageSize = %j', startNum, pageSize);

        connection.query(getTopList, [startNum, pageSize], function (err, results) {
          if (err) { callback(err); return; }

          callback(null, myRankInfo, results);
        });
      }
    ],

    function (err, myRankInfo, rankList) {
      if (err) {
        endConnection(err);
        callback(err);
        return;
      } else {

        req.params.isLast = isLast;
        req.query.isLast  = isLast;

        var rtnValue = {
          'myRankInfo'    : myRankInfo[0],
          'rankList'      : rankList
        };

        // setTimeout(function() {

          callback(null, rtnValue);

          logger.debug('---topList END---');

          endConnection();
        // }, 1);

        return;
      }
    }
  ); // end waterfall}

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

module.exports = topList;