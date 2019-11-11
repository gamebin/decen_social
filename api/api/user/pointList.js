/**
 * pointList : get user point history
 * Created by stub on 2017-08-17.
 */

var async       = require('async');
var utils = require('../../constants/utils');

var pointList = {
  execute : function(req, res, callback) {
    return execute(req, res, callback);
  }
};

function execute(req, res, callback) {
  logger.debug('---pointList START---');

  var userId    = (req.params && req.params.userId) || (req.body && req.body.userId) || (req.query && req.query.userId) || req.headers['x-userId'];
  var pageNo    = (req.params && req.params.pageNo) || (req.body && req.body.pageNo) || (req.query && req.query.pageNo) || req.headers['x-pageNo'];
  var pageSize  = (req.params && req.params.pageSize) || (req.body && req.body.pageSize) || (req.query && req.query.pageSize) || req.headers['x-pageSize'];
  var isLast    = 'false';

  logger.debug('userId : %j, pageNo : %j, pageSize : %j', userId, pageNo, pageSize);

  if (!userId) {
    var errorMessage = 'userId required.';
    logger.error(errorMessage);
    return callback(errorMessage);
  }

  var getUserPointInfo = 'SELECT userId, userName, userPoint FROM user WHERE userId=\'' + userId + '\' ';
  logger.debug('getUserPointInfo : %j', getUserPointInfo);
  var getUserSumPointInfo  = 'SELECT ';
      getUserSumPointInfo += '  userId, sign1, sum(point) ';
      getUserSumPointInfo += 'FROM ';
      getUserSumPointInfo += '  user_reward_log ';
      getUserSumPointInfo += 'WHERE ';
      getUserSumPointInfo += '  MONTH(writeDate)=MONTH(CURRENT_DATE()) AND userId=\'' + userId + '\' ';
      getUserSumPointInfo += 'GROUP BY userId, sign1 ';
  logger.debug('getUserSumPointInfo : %j', getUserSumPointInfo);
  var getUserPointListCnt = 'SELECT count(sign1) FROM user_reward_log WHERE userId=\'' + userId + '\' ';
  logger.debug('getUserPointListCnt : %j', getUserPointListCnt);
  var getUserPointList  = 'SELECT ';
      getUserPointList += '  sign1, point, writeDate, comments, a.actId, ';
      getUserPointList += '  (SELECT actname FROM activity WHERE a.actId=actId) as actname ';
      getUserPointList += 'FROM user_reward_log a ';
      getUserPointList += 'WHERE userId=\'' + userId + '\' ';
      getUserPointList += 'ORDER BY rewLogSerno DESC LIMIT ?, ? ';
  logger.debug('getUserPointList : %j', getUserPointList);

  var connection = utils.createOldConnection();

  async.waterfall(
    [
      // 01. get user point info
      function (callback) {
        connection.query(getUserPointInfo, function (err, results) {
          if (err) { logger.error(err); return callback(err); }
          if (results.length < 1) { var errorMessage = 'no user point information.'; logger.error(errorMessage); return callback(errorMessage); }

          callback(null, results[0].userPoint);
        });
      },

      // 02. get sum user point info of this month 
      function (userPoint, callback) {
        connection.query(getUserSumPointInfo, function (err, results) {
          if (err) { logger.error(err); return callback(err); }

          callback(null, userPoint, results);
        });
      },

      // 03. get user point history
      function (userPoint, pointSumInfos, callback) {
        connection.query(getUserPointListCnt, function (err, results) {
          if (err) { logger.error(err); return callback(err); }

          if (results[0].count < pageNo*pageSize) isLast = 'true';

          var startNum = (pageNo-1)*pageSize;
          logger.debug('[pointList] startNum = %j, pageSize = %j', startNum, pageSize);

          connection.query(getUserPointList, [startNum, pageSize], function(err1, results1) {
            if (err1) { logger.error(err1); return callback(err1); }

            callback(null, userPoint, pointSumInfos, results1);
          });
        });
      }
    ],

    function (err, userPoint, pointSumInfos, pointList) {
      if (err) {
        endConnection(err);
        callback(err);
        return;
      } else {
        req.params.isLast = isLast;
        req.query.isLast  = isLast;
        
        var userPointList = {
          'userPoint'     : userPoint,
          'pointSumInfos' : pointSumInfos,
          'pointList'     : pointList
        };

        callback(null, userPointList);
        logger.debug('---pointList END---');

        endConnection();
        return;
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

module.exports = pointList;