/**
 * feed : get news feed
 * Created by stub on 2016-03-14.
 */

var async       = require('async');
var utils = require('../../constants/utils');

var feed = {
  execute : function(req, res, callback) {
    return execute(req, res, callback);
  }
};

function execute(req, res, callback) {
  logger.debug('---feed START---');

  var appId     = (req.params && req.params.appId) || (req.body && req.body.appId) || (req.query && req.query.appId) || req.headers['x-appId'];
  var userId    = (req.params && req.params.userId) || (req.body && req.body.userId) || (req.query && req.query.userId) || req.headers['x-userId'];
  var isFriend  = (req.params && req.params.isFriend) || (req.body && req.body.isFriend) || (req.query && req.query.isFriend) || req.headers['x-isFriend'];
  var isMine    = (req.params && req.params.isMine) || (req.body && req.body.isMine) || (req.query && req.query.isMine) || req.headers['x-isMine'];
  var pageNo    = (req.params && req.params.pageNo) || (req.body && req.body.pageNo) || (req.query && req.query.pageNo) || req.headers['x-pageNo'];
  var pageSize  = (req.params && req.params.pageSize) || (req.body && req.body.pageSize) || (req.query && req.query.pageSize) || req.headers['x-pageSize'];
  var isLast    = 'false';

  logger.debug('appId : %j, userId : %j, isFriend : %j, isMine : %j', appId, userId, isFriend, isMine);

  if (!appId) {
    var errorMessage = 'appId required';
    logger.error(errorMessage);
    return callback(errorMessage);
  }

  var getLiveFeedCnt = '';
  if (isFriend == 'Y') {
    getLiveFeedCnt += 'SELECT count(a.recordSerno) as count ';
    getLiveFeedCnt += 'FROM User_record a ';
    getLiveFeedCnt += 'INNER JOIN friend d ON a.userId = d.friendUserId AND a.appId = d.appId ';
    getLiveFeedCnt += 'WHERE a.appid=\'' + appId + '\' and (friendStusDstcd = \'R2\' or friendStusDstcd = \'A2\') and d.userid = \'' + userId + '\' AND d.friendUserId <> \'' + userId + '\'';
  } else {
    getLiveFeedCnt += 'SELECT count(a.recordSerno) as count ';
    getLiveFeedCnt += 'FROM User_record a ';
    getLiveFeedCnt += 'WHERE a.appId = \'' + appId + '\' ';
    if (isMine == 'Y' || isMine == 'y') {
      getLiveFeedCnt += 'AND a.userId = \'' + userId + '\' ';
    }
  }

  logger.debug('getLiveFeedCnt : %j', getLiveFeedCnt);

  var getLiveFeed = '';
  getLiveFeed += 'SELECT ';
  getLiveFeed += '   a.recordSerno, ';
  getLiveFeed += '   a.UserId, ';
  getLiveFeed += '  (SELECT UserName FROM User WHERE UserId = a.UserId and appId = a.appId) as Username, ';
  getLiveFeed += '  (SELECT userImg FROM USER WHERE UserId = a.UserId AND appId = a.appId) as userImg, ';
  getLiveFeed += '  actName, ';
  getLiveFeed += '  a.regiYHS ';
  getLiveFeed += 'FROM ';

  if (isFriend == 'Y') {
    getLiveFeed += '   User_record a INNER JOIN Activity b ON a.actId = b.actId ';
    getLiveFeed += '   INNER JOIN friend d ON a.userId = d.friendUserId AND a.appId = d.appId ';
    getLiveFeed += 'WHERE a.appid=\'' + appId + '\' and (friendStusDstcd = \'R2\' or friendStusDstcd = \'A2\') and d.userid = \'' + userId + '\' AND d.friendUserId <> \'' + userId + '\'';
    getLiveFeed += 'ORDER BY recordSerno DESC limit ?, ? ';
  } else {
    getLiveFeed += '   User_record a INNER JOIN Activity b ON a.actId = b.actId ';
    getLiveFeed += 'WHERE a.appId = \'' + appId + '\' ';
    if (isMine == 'Y' || isMine == 'y') {
      getLiveFeed += 'AND a.userId = \'' + userId + '\' ';
    }
    getLiveFeed += 'ORDER BY recordSerno DESC limit ?, ?';
  }

  logger.debug('getLiveFeed : %j', getLiveFeed);

  var connection = utils.createOldConnection();

  async.waterfall(
    [
      // 01. newsFeed 총 카운트 조회
      function (callback) {
        connection.query(getLiveFeedCnt, function (err, results) {
          if (err) { callback(err); return; }
          logger.debug('[feed] newsFeed 총 카운트 조회 >>> %j', results);
          callback(null, results);
        });
      },

      // 02. newsFeed 리스트 조회
      function (newsCnt, callback) {
        logger.debug('[feed] newsCnt[0].count = %j, pageNo = %j, pageSize = %j', newsCnt[0].count, pageNo, pageSize);
        if (newsCnt[0].count < pageNo*pageSize) {
          isLast = 'true';
        }
        var startNum = (pageNo-1)*pageSize;
        logger.debug('[feed] startNum = %j, pageSize = %j', startNum, pageSize);

        connection.query(getLiveFeed, [startNum, pageSize], function (err, results) {
          if (err) { callback(err); return; }

          callback(null, results);
        });
      }
    ],

    function (err, newsList) {
      if (err) {
        endConnection(err);
        callback(err);
        return;
      } else {

        req.params.isLast = isLast;
        req.query.isLast  = isLast;

        // setTimeout(function() {
          callback(null, newsList);

          logger.debug('---feed END---');

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

module.exports = feed;