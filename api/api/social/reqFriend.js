/**
 * reqFriend : request new friend
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

var reqFriend = {
  execute : function(req, res, callback) {
    return execute(req, res, callback);
  }
};

function execute(req, res, callback) {
  logger.debug('--reqFriend START--');

  var appId         = (req.params && req.params.appId) || (req.body && req.body.appId) || (req.query && req.query.appId) || req.headers['appId'];
  var userId        = (req.params && req.params.userId) || (req.body && req.body.userId) || (req.query && req.query.userId) || req.headers['userId'];
  var friendUserId  = (req.params && req.params.friendUserId) || (req.body && req.body.friendUserId) || (req.query && req.query.friendUserId) || req.headers['x-friendUserId'];

  if (!friendUserId) {
    var errorMessage = 'friendUserId required';
    logger.error(errorMessage);
    return callback(errorMessage);
  }

  var connection;

  var currentStatusQuery =
        'SELECT '
        + '   friendUserId       as friendUserId, '
        + '   applystartYmd      as applystartYmd, '
        + '   friendStusDstcd    as friendStusDstcd '
        + '   FROM    friend '
        + '   WHERE   userId  = ?  and friendUserId = ? '
        + '     AND     (friendStusDstcd = \'R1\' or friendStusDstcd = \'A1\' '
        + '           or friendStusDstcd = \'R2\' or friendStusDstcd = \'A2\' '
        + '           or friendStusDstcd = \'R3\' or friendStusDstcd = \'A3\')';

  var registerFriendQuery = 'INSERT INTO friend SET ?';
  var registerMessageQuery = 'INSERT INTO message SET ?';

  var moment = require('moment');
  var currentDate = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
  var friendInfo  = {
    'userId'          : userId,
    'friendUserId'    : friendUserId,
    'friendStusDstcd' : '',
    'applystartYmd'   : currentDate,
    'appId'           : appId
  };
  logger.debug(friendInfo);

  var messageInfo = {
    'userId'        : userId,
    'receiverId'    : friendUserId,
    'sendRecvDstcd' : '',
    'contents'      : '',
    'readStusDstcd' : '',
    'regiYHS'       : currentDate,
    'appId'         : appId
  };
  logger.debug(messageInfo);

  connection = utils.createOldConnection();

  connection.beginTransaction(function (err) {
    if (err) {
      logger.error(err);
      endConnection(err);
      return callback(err);
    }

    async.waterfall(
      [

        // 01. 친구로 되어 있는 상태(R2,A2) 혹은 요청중인 상태(R1,A1)인지 거부 상태(R3, A3) 여부 확인
        function (callback) {

          connection.query(currentStatusQuery, [userId, friendUserId], function (err, results) {
            if (err) { callback(err); return; }

            if (results.length > 0) {
              callback('Already requested.');
              return;
            }

            callback(null, results);
          });
        },

        // 02. 친구로 등록되어 있지 않으면 요청자(userId-friendId)
        function (results, callback) {

          friendInfo.friendStusDstcd = RequestFriendRequest;

          connection.query(registerFriendQuery, friendInfo, function (err, results) {
            if (err) { callback(err); return; }

            callback(null, results);
          });
        },

        // 02-1. 요청자 친구요청 메시지 등록
        function (results, callback) {

          messageInfo.sendRecvDstcd   = SendFriend;
          messageInfo.contents        = '[' + friendUserId + '] 친구로 요청 함';
          messageInfo.readStusDstcd   = Read;

          connection.query(registerMessageQuery, messageInfo, function (err, results) {
            if (err) { callback(err); return; }

            callback(null, results);
          });
        },

        // 03. 승인자(friendId-userId) 로 데이타 추가
        function (results, callback) {

          friendInfo.userId           = friendUserId;
          friendInfo.friendUserId     = userId;
          friendInfo.friendStusDstcd  = AcceptFriendRequest;

          connection.query(registerFriendQuery, friendInfo, function (err, results) {
            if (err) { callback(err); return; }

            callback(null, results);
          });
        },

        // 03-1. 승인자 친구요청 메시지 등록
        function (results, callback) {

          messageInfo.userId          = friendUserId;
          messageInfo.receiverId      = userId;
          messageInfo.sendRecvDstcd   = ReceiveFriend;
          messageInfo.contents        = '[' + userId + ']로 부터 친구로 요청 됨';
          messageInfo.readStusDstcd   = NotRead;

          connection.query(registerMessageQuery, messageInfo, function (err, results) {
            if (err) { callback(err); return; }

            callback(null, results);
          });
        }

      ],

      function (err, result) {
        logger.debug('result>>>' + result);
        logger.debug('---reqFriend END---');

        if (err) {
          logger.error(err);
          rollback(err);
          return callback('failed - ' + err);
        }
        else {
          connection.commit(function (err) {
            if (err) {
              logger.error(err);
              rollback(err);
            } else {
              logger.debug('-commit completed-');
            }
          });

          endConnection();
          callback(null, 'success');

          return;
        }
      }
    ); // end waterfall

  }); // end beginTransaction

  function endConnection(err) {
    if (err) {
      logger.error(err);
      connection.end(
        function (err) {
          if(!err) connection = null;
          else logger.debug(err)
        }
      );
    } else {
      connection.end(function () {
        logger.debug('connection closed');
      });
    }
  }

  function rollback(err) {
    connection.rollback(function () {
      logger.debug(err);
      logger.error('connection rollbacked');
      endConnection();
    });
  }
}

module.exports = reqFriend;