/**
 * procReqFriend : accept or deny as a new friend
 * Created by stub on 2016-03-14.
 */

var async   = require('async');
var utils = require('../../constants/utils');

// FriendStusDstcd
var RequestFriendRequest = "R1";
var RequestFriendAccept  = "R2";
var RequestFriendDeny    = "R3";
var AcceptFriendRequest  = "A1";
var AcceptFriendAccept   = "A2";
var AcceptFriendDeny     = "A3";
var DeleteFriend         = "99";

// SendRecvDstcd
var SendMessage       = "SS";
var ReceiveMessage    = "RR";
var SendFriend        = "SF";
var ReceiveFriend     = "RF";
var SendGame          = "SG";
var ReceiveGame       = "RG";

// ReadStusDstcd
var NotRead     = "01";
var Read        = "02";
var Delete      = "03";

var procReqFriend = {
  execute : function(req, res, callback) {
    return execute(req, res, callback);
  }
};

function execute(req, res, callback) {
  logger.debug('--procReqFriend START--');

  var appId         = (req.params && req.params.appId) || (req.body && req.body.appId) || (req.query && req.query.appId) || req.headers['appId'];
  var userId        = (req.params && req.params.userId) || (req.body && req.body.userId) || (req.query && req.query.userId) || req.headers['userId'];
  var friendUserId  = (req.params && req.params.friendUserId) || (req.body && req.body.friendUserId) || (req.query && req.query.friendUserId) || req.headers['x-friendUserId'];
  var acceptYN      = (req.params && req.params.acceptYN) || (req.body && req.body.acceptYN) || (req.query && req.query.acceptYN) || req.headers['x-acceptYN'];

  if (!acceptYN) {
    var errorMessage = 'acceptYN\'s value must be \'Y\' or \'N\'';
    logger.error(errorMessage);
    return callback(errorMessage);
  }

  var conn;

  var updateFriendStatusQuery   = 'UPDATE friend SET friendStusDstcd=? WHERE userid=? and friendUserid=? and appId=?';
  var updateMessageStatusQuery  = 'UPDATE message SET readStusDstcd=? WHERE userid=? and receiverId=? and appId=?';

  conn = utils.createOldConnection();

  conn.beginTransaction(function (err) {
    if (err) {
      logger.error(err);
      endConnection(err);
      return callback(err);
    }

    async.waterfall(
      [
        // 01. 요청자 상태값 변경
        function (callback) {
          if (acceptYN == 'Y') {
            conn.query(updateFriendStatusQuery, [AcceptFriendAccept, userId, friendUserId, appId], function (err, results) {
              if (err) { callback(err); return; }

              callback(null, results);
            });
          } else {
            conn.query(updateFriendStatusQuery, [AcceptFriendDeny, userId, friendUserId, appId], function (err, results) {
              if (err) { callback(err); return; }

              callback(null, results);
            });
          }
        },

        // 02. 승인자 상태값 변경
        function (results, callback) {
          if (acceptYN == 'Y') {
            conn.query(updateFriendStatusQuery, [RequestFriendAccept, friendUserId, userId, appId], function (err, results) {
              if (err) { callback(err); return; }

              callback(null, results);
            });
          } else {
            conn.query(updateFriendStatusQuery, [RequestFriendDeny, friendUserId, userId, appId], function (err, results) {
              if (err) { callback(err); return; }

              callback(null, results);
            });
          }
        },

        // 03. 요청자 메시지 상태값 변경
        function (results, callback) {
          conn.query(updateMessageStatusQuery, [Delete, userId, friendUserId, appId], function (err, results) {
            if (err) { callback(err); return; }

            callback(null, results);
          });
        },

        // 03. 수락자 메시지 상태값 변경
        function (results, callback) {
          conn.query(updateMessageStatusQuery, [Delete, friendUserId, userId, appId], function (err, results) {
            if (err) { callback(err); return; }

            callback(null, results);
          });
        }
      ],

      function (err, result) {
        logger.debug('result>>>' + result);
        logger.debug('---procReqFriend END---');

        if (err) {
          logger.error(err);
          rollback(err);
          return callback(err);
        }
        else {
          conn.commit(function (err) {
            if (err) {
              logger.error(err);
              rollback(err);
              return callback(err);
            } else {
              logger.debug('-commit completed-');
            }
          });
        }

        endConnection();

        return callback(null, 'success');
      }
    ); // end waterfall

  }); // end beginTransaction

  function endConnection(err) {
    if (err) {
      logger.error(err);
      conn.end(
        function (err) {
          if (!err) conn = null;
          else logger.debug(err)
        }
      );

    } else {
      conn.end(function () {
        logger.debug('connection closed');
      });
    }
  }

  function rollback(err) {
    conn.rollback(function () {
      logger.debug(err);
      logger.error('connection rollbacked');
      endConnection();
    });
  }
}

module.exports = procReqFriend;