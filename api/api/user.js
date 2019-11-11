
var feed          = require('./user/feed.js');
var profile       = require('./user/profile.js');
var updateProfile = require('./user/updateProfile.js');
var topList       = require('./user/topList.js');
var activity      = require('./user/activity.js');
var rewardList    = require('./user/rewardList.js');

var achievement   = require('./user/achievement.js');
var pointList     = require('./user/pointList.js');
var userLevel     = require('./user/userLevel.js');

var user = {

  // Get Live Feed
  feed: function(req, res, next) {
    feed.execute(req, res, function(err, _rtnValue) {
      if(err) return next(err);
      rtnQuery(req, res, _rtnValue);
    });
  },

  // Get User Profile
  profile: function(req, res, next) {
    profile.execute(req, res, function(err, _rtnValue) {
      if(err) return next(err);
      rtnQuery(req, res, _rtnValue);
    });
  },

  // Update User Profile
  updateProfile: function(req, res, next) {
    updateProfile.execute(req, res, function(err, _rtnValue) {
      if(err) return next(err);
      rtnQuery(req, res, _rtnValue);
    });
  },

  // Get Top List
  toplist: function(req, res, next) {
    topList.execute(req, res, function(err, _rtnValue) {
      if(err) return next(err);
      rtnQuery(req, res, _rtnValue);
    });
  },

  // User Activity Post
  activity: function(req, res, next) {
    activity.execute(req, res, function(err, _rtnValue) {
      if(err) return next(err);
      rtnQuery(req, res, _rtnValue);
    });
  },

  // Get reward list
  rewardList: function(req, res, next) {
    rewardList.execute(req, res, function(err, _rtnValue) {
      if(err) return next(err);
      rtnQuery(req, res, _rtnValue);
    });
  },

  // User Achievement List
  achievement: function(req, res, next) {
    achievement.execute(req, res, function(err, _rtnValue) {
      if(err) return next(err);
      rtnQuery(req, res, _rtnValue);
    });
  },

  // User Point List
  pointList: function(req, res, next) {
    pointList.execute(req, res, function(err, _rtnValue) {
      if(err) return next(err);
      rtnQuery(req, res, _rtnValue);
    });
  },

  // User Level Info
  userLevel: function(req, res, next) {
    userLevel.execute(req, res, function(err, _rtnValue) {
      if(err) return next(err);
      rtnQuery(req, res, _rtnValue);
    });
  }

};

function rtnQuery(req, res, _rtnValue) {
  var rtnValue    = (req.params && req.params.rtnValue) || (req.body && req.body.rtnValue) || (req.query && req.query.rtnValue) || req.headers['rtnValue'];
  var isLast      = (req.params && req.params.isLast) || (req.body && req.body.isLast) || (req.query && req.query.isLast) || req.headers['isLast'];
  var loggedInYN  = (req.params && req.params.loggedInYN) || (req.body && req.body.loggedInYN) || (req.query && req.query.loggedInYN) || req.headers['loggedInYN'];

  logger.debug('[user] isLast >>> %j, _rtnValue >>> %j, loggedInYN >>> %j', isLast, _rtnValue, loggedInYN);
  var updatedToken, token;
  if (loggedInYN === 'N') {
    updatedToken  = 'N';
  } else {
    updatedToken  = req.body.rtnValue.updatedToken;
    token         = req.body.rtnValue.token;
  }

  res.status(200);
  res.json({
    'updatedToken'  : updatedToken,
    'isLast'        : isLast,
    'token'         : token,
    'result'        : _rtnValue
  });
}

module.exports = user;