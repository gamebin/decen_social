/**
 * activity : 사용자 activity 처리
 * Created by stub on 2016-03-14.
 */

var async       = require('async');
var utils = require('../../constants/utils');

var activity = {
  execute : function(req, res, callback) {
    return execute(req, res, callback);
  }
};

function execute(req, res, callback) {
  logger.debug('---activity START---');
  var appId       = (req.params && req.params.appId) || (req.body && req.body.appId) || (req.query && req.query.appId) || req.headers['x-appId']; // "app_ZCmrndUg00000";
  var actId       = (req.params && req.params.actId) || (req.body && req.body.actId) || (req.query && req.query.actId) || req.headers['x-actId']; // "act_ijPomTe700000";
  var userId      = (req.params && req.params.userId) || (req.body && req.body.userId) || (req.query && req.query.userId) || req.headers['userId'];
  var deviceType  = (req.params && req.params.deviceType) || (req.body && req.body.deviceType) || (req.query && req.query.deviceType) || req.headers['deviceType'];
  var IP          = (req.params && req.params.IP) || (req.body && req.body.IP) || (req.query && req.query.IP) || req.headers['IP'];
  var countryCode = (req.params && req.params.countryCode) || (req.body && req.body.countryCode) || (req.query && req.query.countryCode) || req.headers['countryCode'];
  var cityName    = (req.params && req.params.cityName) || (req.body && req.body.cityName) || (req.query && req.query.cityName) || req.headers['cityName'];
  var targetId    = (req.params && req.params.targetId) || (req.body && req.body.targetId) || (req.query && req.query.targetId) || req.headers['targetId'];

  logger.debug('appId:::%j, actId:::%j, userId:::%j, targetId:::%j', appId, actId, userId, targetId);
 
  if (!appId || !actId) {
    logger.error('appId and actId required');
    return callback('appId and actId required');
  }

  if (!userId) return callback('userId required');

  var conn = utils.createOldConnection();

  if (!deviceType || deviceType === '')
    deviceType = 'A';

  if (!targetId || targetId === '') {
    targetId = 'NA';
  }

  var moment = require('moment');
  var currentDate = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
  logger.debug('currentDate >>> ', currentDate);
  
  var activityInfo = {
    'appId'     : appId,
    'actId'     : actId,
    'regiYHS'   : currentDate,
    'userIP'    : IP,
    'userId'    : userId,
    'deviceType': deviceType,
    'accCountry': countryCode,
    'accCity'   : cityName,
    'targetId'  : targetId
  };

  logger.debug(activityInfo);

  var getRewardInfo     = 'SELECT a.actName, b.rewKind, b.rewardValue, b.restricted FROM activity a INNER JOIN activity_reward b on a.actId = b.actId WHERE b.actId=\'' + actId + '\' and a.appId=\'' + appId + '\'';
  var getUserPoint      = 'SELECT userPoint, possessBadges FROM user WHERE userId=\'' + userId + '\' and appId=\'' + appId + '\'';
  var updateUserPoint   = 'UPDATE user SET userPoint=? WHERE userId=? and appId=?';
  var getUserBadgeInfo  = 'SELECT badgeId FROM user_badges WHERE userId=? and badgeId=? and appId=?';
  var insertUserBadge   = 'INSERT INTO user_badges SET ?';
  var updateUserBadge   = 'UPDATE user SET possessBadges=? WHERE userid=? and appId=?';
  var recordUserHist    = 'INSERT INTO user_record SET ?';
  // var getUserHistDay    = 'SELECT * FROM user_record WHERE regiYHS > CURRENT_DATE() and userId=? and appId=? and actId=? and targetId=? and deleteYN=\'N\'';
  var getUserHistDay    = 'SELECT * FROM user_record WHERE regiYHS > CURRENT_DATE() and userId=? and appId=? and actId=? and deleteYN=\'N\'';
  var getUserHistOne    = 'SELECT * FROM user_record WHERE userId=? and appId=? and actId=? and targetId=? and deleteYN=\'N\'';

  var getAchiRewardInfo = 'SELECT a.achiId, actId, appId, a.achiName, point, badgeId, delFlag, count ';
    getAchiRewardInfo  += 'FROM achievement a INNER JOIN achievement_sub b ON a.achiId = b.achiId ';
    getAchiRewardInfo  += 'WHERE actId=? AND delFlag=\'N\' ';
  var getUserAchiLHist  = 'SELECT count(userId) as count FROM achievement_user_log WHERE userId=? AND actId=?';
  var getUserAchiCHist  = 'SELECT count(userId) as count FROM achievement_user_comp WHERE userId=? AND achiId=? AND appId=?';
  var setUserAchiLHist  = 'INSERT INTO achievement_user_log SET ?';
  var setUserAchiComp   = 'INSERT INTO achievement_user_comp SET ?';

  conn.beginTransaction( function(err) {
    if (err) {
      logger.error(err);
      endConnection(err);
      return;
    }

    async.waterfall(
      [
        // 01. get reward information
        function (callback) {
          logger.debug('getRewardInfo ::: ' + getRewardInfo);
          conn.query(getRewardInfo, function(err, results) {
            if (err) { logger.error(err); return callback(err); }
            else {
              if (results.length < 1) {
                var errorMessage = 'Invalid actId. There is no reward info.';
                logger.error(errorMessage);
                return callback(errorMessage);
              } else {
                conn.query(getUserPoint, function(err1, results1) {
                  if (err1) { logger.error(err1); return callback(err); }
                  else {
                    if (results1.length < 1) {
                      var errorMessage1 = 'Invalid userId or appId. There is no user info.';
                      logger.error(errorMessage1);
                      return callback(errorMessage1);
                    }

                    logger.debug('[activity] -step 1-');

                    logger.debug('rewData ::: %j', results);
                    logger.debug('userData ::: %j', results1);
                    return callback(null, results, results1);
                  }
                });
              }
            }
          });
        },

        // 02. do reward and check the achievement info
        function (rewData, userData, callback) {
          async.each(rewData, doProcess.bind(null, userData, true), function(err) {
            if (err) { logger.error(err); return callback(err); }
            else {
              logger.debug('[activity] -step 2-');
 
              return callback(null, 'completed');            
            }
          });
        },

        function (doRewardResult, callback) {

          getAchievementInfos( function(err, achiRewardInfo, userAchiLHistCnt) {
            logger.debug('achiRewardInfo ::: %j, userAchiLHistCnt ::: %j', achiRewardInfo, userAchiLHistCnt);

            if ( achiRewardInfo == 'completed' || 
                 userAchiLHistCnt < achiRewardInfo[0].count ) 
              return callback(null, 'activity completed');

            var actName = achiRewardInfo[0].achiName;
            var achiRewardsP = {
              'actName'     : actName,
              'rewKind'     : 'P',
              'rewardValue' : '',
              'restricted'  : 'N'
            };
            var achiRewardsB = {
              'actName'     : actName,
              'rewKind'     : 'B',
              'rewardValue' : '',
              'restricted'  : 'N'
            }

            var rewData = [];

            if (achiRewardInfo[0].point > 0)  {
              achiRewardsP.rewardValue = achiRewardInfo[0].point;
              rewData.push(achiRewardsP);
            }
            if (achiRewardInfo[0].badgeId && achiRewardInfo[0].badgeId != '')    {
              achiRewardsB.rewardValue = achiRewardInfo[0].badgeId;
              rewData.push(achiRewardsB);
            }

            logger.debug('rewData ::: %j', rewData);

            conn.query(getUserPoint, function(err, results) {
              if (err) { logger.err(err); return callback(err); }

              async.each(rewData, doProcess.bind(null, results, false), function(err1) {
                if (err1) { logger.error(err1); return callback(err1); }
                else {
                  logger.debug('[activity] -step 3-');
     
                  var userAchiComp = {
                    'userId'    : userId,
                    'achiId'    : achiRewardInfo[0].achiId,
                    'compDate'  : currentDate,
                    'appId'     : appId
                  };

                  conn.query(setUserAchiComp, userAchiComp, function(err2, results2) {
                    if (err2) { logger.err(err2); return callback(err2); }

                    return callback(null, 'activity and achievement completed');
                  });
                }
              });
            });
          });

        }
      ],

      function (err, result) {
        logger.debug('[activity] result>>>'+result);
        logger.debug('---activity END---');

        if (err) { logger.error(err); callback('failed - ' + err); rollback(err);  return; }
        else {
          conn.query(recordUserHist, activityInfo, function(err, rows, fields) {
            if (err) { logger.error(err); return endConnection(err); }
            endConnection();
          });

          conn.commit(function(err) {
            if(err) { 
              logger.error(err); return rollback(err);
            } else {
              logger.debug('-connection commit-');
            }
          });
        }

        return callback(null, result);
      }

    ); // end waterfall

  }); // end beginTransaction

  function endConnection(err) {
    if(err) {
      logger.error(err);
      conn.end(
       function(err){
         if(!err)conn=null;
         else logger.debug(err)
       }
      );
    } else {
      conn.end(function() {
      logger.debug('connection closed');
      });
    }
  }

  function rollback(err) {
    conn.rollback(function() {
      logger.debug(err);
      logger.error('connection rollbacked');
      endConnection();
    });
  }

  function doProcess(userData, isFromActivity, rewData, callback) {
    logger.debug('isFromActivity ::: %j', isFromActivity);

    logger.debug('rewData ::: %j, userData ::: %j', rewData, userData);
    logger.debug('rewData.rewKind ::: %j', rewData.rewKind);
    logger.debug('rewData.restricted ::: %j', rewData.restricted);

    if (rewData.restricted == 'A' || rewData.restricted == 'a') {
      conn.query(getUserHistOne, [userId, appId, actId, targetId], function(err, results) {
        logger.debug('getUserHistOne results.length:::' + results.length);
        if (err) { logger.error(err); return callback(err); }

        if (results.length < 1) {
          updateUserInfos(rewData, userData, function(err1) {
            if (err1) { logger.error(err1); return callback(err1); }
            else {
              if (!isFromActivity) return callback();
              updateUserAchiInfos( function(err2) {
                if (err2) { logger.error(err2); return callback(err2); }
                else return callback();
              });
            }
          });
        } else return callback();
      });
    } else if (rewData.restricted == 'N' || rewData.restricted == 'n') {
      updateUserInfos(rewData, userData, function(err1) {
        if (err1) { logger.error(err1); return callback(err1); }
        else {
          if (!isFromActivity) return callback();
          updateUserAchiInfos( function(err2) {
            if (err2) { logger.error(err2); return callback(err2); }
            else return callback();
          });
        }
      });
    } else {
      var restrictDays = rewData.restricted;

      conn.query(getUserHistDay, [userId, appId, actId], function(err, results) {
        logger.debug('[activity] getUserHistDay results.length:::' + results.length);
        if (err) { logger.error(err); return callback(err); }
        if (results.length < restrictDays) {
          updateUserInfos(rewData, userData, function(err1) {
            if (err1) { logger.error(err1); return callback(err1); }
            else {
              if (!isFromActivity) return callback();
              updateUserAchiInfos( function(err2) {
                if (err2) { logger.error(err2); return callback(err2); }
                else return callback();
              });
            }
          });
        } else return callback();
      });
    }
  }

  function updateUserInfos(rewData, userData, next) {
    if (rewData.rewKind == 'P') {
      logger.debug(rewData.rewardValue);
      logger.debug(userData[0].userPoint);

      var setUserPoint = parseInt(rewData.rewardValue) + parseInt(userData[0].userPoint);

      var updateData = [setUserPoint, userId, appId];
      logger.debug(updateData);

      conn.query(updateUserPoint, updateData, function(err1, results1) {
        if (err1) { logger.error(err1); return next(err1); }

        var userPointLog = {
          'userId'        : userId,
          'sign1'         : '+',
          'point'         : rewData.rewardValue,
          'WriteDate'     : currentDate,
          'appId'         : appId,
          'actId'         : actId,
          'comments'      : rewData.actName + ' 완료'
        };

        logger.debug('userPointLog ::: %j', userPointLog);

        var setUserPointLog = 'INSERT INTO user_reward_log SET ?';
        conn.query(setUserPointLog, userPointLog, function(err2, results2) {
          if (err2) { logger.error(err2); return next(err2); }
          else return next();
        })
      });
    } else if (rewData.rewKind == 'B') {
      var userBadgeInfo = {
        'userId'  : userId,
        'badgeId' : rewData.rewardValue,
        'appId'   : appId,
        'regiYHS' : currentDate,
        'userIP'  : IP 
      };

      logger.debug('userBadgeInfo ::: %j', userBadgeInfo);

      conn.query(getUserBadgeInfo, [userBadgeInfo.userId, userBadgeInfo.badgeId, userBadgeInfo.appId], function(err1, results1) {
        logger.debug('[activity] results1.length:::' + results1.length);

        if (err1) { logger.error(err1); return next(err1); }
        else {
          if (results1.length < 1) {
            logger.debug('[activity] badgeId ::: %s, badge count ::: %s', userBadgeInfo.badgeId, userData[0].possessBadges);

            conn.query(insertUserBadge, userBadgeInfo, function(err2, results2) {
              if (err2) { logger.error(err2); return next(err2); }

              var updateData = [parseInt(userData[0].possessBadges)+1, userId, appId];
              logger.debug(updateData);
              conn.query(updateUserBadge, updateData, function(err3, results3) {
                if (err3) { logger.error(err3); return next(err3); }
                else return next();
              });
            });
          } else return next();
        }
      });
    }
  }

  function updateUserAchiInfos(next) {
    getAchievementInfos( function(err, achiRewardInfo, userAchiLHistCnt) {
      if (err) { logger.err(err); return next(err); }
      if (achiRewardInfo == 'completed' || achiRewardInfo.length < 1) return next();

      var achiId = achiRewardInfo[0].achiId;

      conn.query(getUserAchiCHist, [userId, achiId, appId], function(err, results) {
        logger.debug('getUserAchiCHist err ::: %j, results ::: %j', err, results);
        if (err) { logger.err(err); return next(err); }

        if (results[0].count > 0) return next();

        var userAchiLog = {
          'userId'    : userId,
          'achiId'    : achiId,
          'actId'     : actId,
          'regiYHS'   : currentDate,
          'appId'     : appId
        };
        logger.debug('userAchiLog ::: %j', userAchiLog);

        conn.query(setUserAchiLHist, userAchiLog, function(err1, results1) {
          logger.debug('setUserAchiLHist err1 ::: %j, results1 ::: %j', err1, results1);
          if (err1) { logger.err(err1); return next(err); }

          return next();
        });                
      });
    });
  }

  function getAchievementInfos(next) {
    conn.query(getAchiRewardInfo, actId, function(err, results) {
      logger.debug('getAchiRewardInfo err ::: %j, results ::: %j', err, results);

      if (err) { logger.err(err); return next(err); }
      if (results.length < 1) return next(null, 'completed');

      var achiId = results[0].achiId;

      conn.query(getUserAchiLHist, [userId, actId], function(err1, results1) {
        logger.debug('getUserAchiLHist err1 ::: %j, results1 ::: %j', err1, results1);
        if (err1) { logger.err(err1); return next(err1); }
        
        var userAchiLHistCnt = results1[0].count;
        return next(null, results, userAchiLHistCnt);
      });
    });
  }
}

module.exports = activity;