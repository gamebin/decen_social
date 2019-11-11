var express = require('express');
var router  = express.Router();

var auth = require('./auth.js');
var kiki = require('./kiki.js');
var util = require('../constants/utils.js');

router.post('/login',                       auth.login);
router.post('/logout',                      auth.logout);

router.get ('/api/v1/kiki/feed',            kiki.feed);
router.get ('/api/v1/kiki/profile',         kiki.profile);
router.post('/api/v1/kiki/updateProfile',   kiki.updateProfile);
router.get ('/api/v1/kiki/toplist',         kiki.toplist);
router.post('/api/v1/kiki/activity',        kiki.activity);
router.get ('/api/v1/kiki/rewardList',      kiki.rewardList);

router.get ('/api/v1/kiki/achievement',     kiki.achievement);
router.get ('/api/v1/kiki/pointList',       kiki.pointList);
router.get ('/api/v1/kiki/userLevel',       kiki.userLevel);

router.get ('/api/v1/kiki/reqfriendlist',   kiki.reqfriendlist);
router.get ('/api/v1/kiki/srcfriend',       kiki.srcfriend);
router.get ('/api/v1/kiki/friendlist',      kiki.friendlist);
router.get ('/api/v1/kiki/sugfriend',       kiki.sugfriend);
router.post('/api/v1/kiki/procreqfriend',   kiki.procreqfriend);
router.post('/api/v1/kiki/reqfriend',       kiki.reqfriend);

// router.post('/api/v1/kiki/pickMgReward',     kiki.pickMgReward);
router.post('/api/v1/kiki/mg/pickrwd',      kiki.pickMgReward);
router.post('/api/v1/kiki/mg/tracklog',     kiki.tracklog);
router.get ('/api/v1/kiki/mg/dclog',        kiki.dclog);

router.post('/api/v1/kiki/gd/userlog',      kiki.userlog);
router.post('/api/v1/kiki/gd/sproduct',     kiki.sproduct);
router.post('/api/v1/kiki/gd/uproduct',     kiki.uproduct);
router.get ('/api/v1/kiki/gd/sugprod',      kiki.sugprod);

// used to check token validation
router.get ('/dummy');

// cafe24 get access_token for internal use only
router.get ('/getCafe24Token',              util.getCafe24Token);
module.exports = router;