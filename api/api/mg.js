
var pickMgReward  = require('./mg/pickMgReward.js');
var tracklog      = require('./mg/tracklog.js');
var dclog         = require('./mg/dclog.js');

var mg = {

  // pickup mini game reward
  pickMgReward: function(req, res, next) {
    pickMgReward.execute(req, res, function(err, _rtnValue) {
      if(err) return next(err);
      rtnQuery(req, res, _rtnValue);
    });
  },

  tracklog: function(req, res, next) {
    tracklog.execute(req, res, function(err, _rtnValue) {
      if(err) return next(err);
      rtnQuery(req, res, _rtnValue);
    })
  },
  
  dclog: function(req, res, next) {
    dclog.execute(req, res, function(err, _rtnValue) {
      if(err) return next(err);
      rtnQuery(req, res, _rtnValue);
    })
  }

};

function rtnQuery(req, res, _rtnValue) {
  logger.debug('[mg] _rtnValue >>> %j', _rtnValue);

  res.status(200);
  res.json({
    updatedToken  : req.body.rtnValue.updatedToken,
    token         : req.body.rtnValue.token,
    result        : _rtnValue
  });
}

module.exports = mg;