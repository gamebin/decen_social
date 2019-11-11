var user   = require('../api/user.js');
var social = require('../api/social.js');
var mg     = require('../api/mg.js');
var gd     = require('../api/gd.js');

var kiki = {

  feed: function(req, res, next) {
    user.feed(req, res, next);
  },

  profile: function(req, res, next) {
    user.profile(req, res, next);
  },

  updateProfile: function(req, res, next) {
    user.updateProfile(req, res, next);
  },

  toplist: function(req, res, next) {
    user.toplist(req, res, next);
  },

  activity: function(req, res, next) {
    user.activity(req, res, next);
  },

  rewardList: function(req, res, next) {
    user.rewardList(req, res, next);
  },

  achievement: function(req, res, next) {
    user.achievement(req, res, next);
  },

  pointList: function(req, res, next) {
    user.pointList(req, res, next);
  },

  userLevel: function(req, res, next) {
    user.userLevel(req, res, next);
  },

  reqfriendlist: function(req, res, next) {
    social.reqfriendlist(req, res, next);
  },

  srcfriend: function(req, res, next) {
    social.srcfriend(req, res, next);
  },

  friendlist: function(req, res, next) {
    social.friendlist(req, res, next);
  },

  sugfriend: function(req, res, next) {
    social.sugfriend(req, res, next);
  },

  procreqfriend: function(req, res, next) {
    social.procreqfriend(req, res, next);
  },

  reqfriend: function(req, res, next) {
    social.reqfriend(req, res, next);
  },

  pickMgReward: function(req, res, next) {
    mg.pickMgReward(req, res, next);
  },

  userlog: function(req, res, next) {
    gd.userlog(req, res, next);
  },

  sproduct: function(req, res, next) {
    gd.sproduct(req, res, next);
  },

  uproduct: function(req, res, next) {
    gd.uproduct(req, res, next);
  },

  sugprod: function(req, res, next) {
    gd.sugprod(req, res, next);
  },

  tracklog: function(req, res, next) {
    mg.tracklog(req, res, next);
  },

  dclog: function(req, res, next) {
    mg.dclog(req, res, next);
  }

};
 
module.exports = kiki;