/**
 * achievement : get a user status of achievement
 * Created by stub on 2017-08-17.
 */
var async       = require('async');
var utils = require('../../constants/utils');

var achievement = {
  execute : function(req, res, callback) {
    return execute(req, res, callback);
  }
};

function execute(req, res, callback) {
  logger.debug('---achievement START---');

  var appId   = (req.params && req.params.appId) || (req.body && req.body.appId) || (req.query && req.query.appId) || req.headers['x-appId'];
  var userId  = (req.params && req.params.userId) || (req.body && req.body.userId) || (req.query && req.query.userId) || req.headers['userId'];

  var pageNo    = (req.params && req.params.pageNo) || (req.body && req.body.pageNo) || (req.query && req.query.pageNo) || req.headers['x-pageNo'];
  var pageSize  = (req.params && req.params.pageSize) || (req.body && req.body.pageSize) || (req.query && req.query.pageSize) || req.headers['x-pageSize'];
  var isLast    = 'false';

  if(!appId || !userId) { var errorMessage = 'appId and userId required.'; logger.error(errorMessage); return callback(errorMessage); }

  logger.debug('appId : %j, userId : %j', appId, userId);

  var conn = utils.createOldConnection();

  var getUserAchiStatus  = 'SELECT SQL_CALC_FOUND_ROWS a.achiId, a.appId, a.achiName, d.badgeImg, count as tCount, count(c.userId) as cCount ';
      getUserAchiStatus += 'FROM achievement a INNER JOIN achievement_sub b ON a.achiId = b.achiId ';
      getUserAchiStatus += 'LEFT JOIN achievement_user_log c on a.achiId = c.achiId and c.appId=\'' + appId + '\' and c.userId=\'' + userId + '\' ';
      getUserAchiStatus += 'LEFT JOIN appbadges d on d.badgeId = a.badgeId ';
      getUserAchiStatus += 'WHERE delFlag=\'N\' ';
      getUserAchiStatus += 'GROUP BY a.achiId, a.appId ';
      getUserAchiStatus += 'LIMIT ?, ? ';

  var getUserAchiStatusCnt = 'SELECT FOUND_ROWS() as count';

  logger.debug('getUserAchiStatus : %j', getUserAchiStatus);

  async.waterfall(
    [
      function (callback) {
        var startNum = (pageNo-1)*pageSize;
        logger.debug('startNum = %j, pageSize = %j', startNum, pageSize);
        conn.query(getUserAchiStatus, [startNum, pageSize], function(err, results) {
          if (err) { logger.error(err); conn.end(); return callback(err); }
          callback(null, results);
        });
      },

      function(achieveList, callback) {
        conn.query(getUserAchiStatusCnt, function(err, results) {
          if (err) { logger.error(err); conn.end(); callback(err); }

          var totCnt = results[0].count;
          logger.debug('totCnt ::: %j', totCnt);

          if (totCnt < pageNo*pageSize) isLast = 'true';
          callback(null, achieveList);
        });
      }
    ],

    function (err, achieveList) {
      if (err) {
        endConnection(err);
        callback(err);
        return;
      } else {

        req.params.isLast = isLast;
        req.query.isLast  = isLast;

        logger.debug('isLast = %j', isLast);
        callback(null, achieveList);

        logger.debug('---achievement END---');

        endConnection();
        return;

      }
    }
  ); // end waterfall

  function endConnection(err) {
    if (err) {
      logger.error(err);
      conn.end(
        function (err) {
          if (!err)conn = null;
          else logger.debug(err)
        }
      );

    } else {
      conn.end(function () {
        logger.debug('connection closed');
      });
    }
  }

}

module.exports = achievement;