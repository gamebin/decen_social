
var reqFriendList   = require('./social/reqFriendList.js');
var srcFriend       = require('./social/srcFriend.js');
var friendList      = require('./social/friendList.js');
var sugFriend       = require('./social/sugFriend.js');
var reqFriend       = require('./social/reqFriend.js');
var procReqFriend   = require('./social/procReqFriend.js');

var social = {

  // Get request user list
  reqfriendlist: function(req, res, next) {
    reqFriendList.execute(req, res, function(err, _rtnValue) {
      if(err) return next(err);
      rtnQuery(req, res, _rtnValue);
    });
  },

  // Search new friends
  srcfriend: function(req, res, next) {
    srcFriend.execute(req, res, function(err, _rtnValue) {
      if(err) return next(err);
      rtnQuery(req, res, _rtnValue);
    });
  },

  // Get my friends list
  friendlist: function(req, res, next) {
    friendList.execute(req, res, function(err, _rtnValue) {
      if(err) return next(err);
      rtnQuery(req, res, _rtnValue);
    });
  },

  // Suggest new friends
  sugfriend: function(req, res, next) {
    sugFriend.execute(req, res, function(err, _rtnValue) {
      if(err) return next(err);
      rtnQuery(req, res, _rtnValue);
    });;
  },

  // Approve requested friend
  procreqfriend: function(req, res, next) {
    procReqFriend.execute(req, res, function(err, _rtnValue) {
      if(err) return next(err);
      rtnQuery(req, res, _rtnValue);
    });
  },

  // Request new friend
  reqfriend: function(req, res, next) {
    reqFriend.execute(req, res, function(err, _rtnValue) {
      if(err) return next(err);
      rtnQuery(req, res, _rtnValue);
    });
  }

};

function rtnQuery(req, res, _rtnValue) {
  logger.debug('[social] _rtnValue >>> %j', _rtnValue);

  res.status(200);
  res.json({
    updatedToken  : req.body.rtnValue.updatedToken,
    token         : req.body.rtnValue.token,
    result        : _rtnValue
  });
}

module.exports = social;