
var userlog    = require('./gd/userlog.js');
var sproduct   = require('./gd/sproduct.js');
var uproduct   = require('./gd/uproduct.js');
var sugprod    = require('./gd/sugprod.js');

var gd = {

  // set user log
  userlog: function(req, res, next) {
    userlog.execute(req, res, function(err, _rtnValue) {
      if(err) return next(err);
      rtnQuery(req, res, _rtnValue);
    });
  },

  sproduct: function(req, res, next) {
    sproduct.execute(req, res, function(err, _rtnValue) {
      if(err) return next(err);
      rtnQuery(req, res, _rtnValue);
    })
  },

  uproduct: function(req, res, next) {
    uproduct.execute(req, res, function(err, _rtnValue) {
      if(err) return next(err);
      rtnQuery(req, res, _rtnValue);
    })
  },

  sugprod: function(req, res, next) {
    sugprod.execute(req, res, function(err, _rtnValue) {
      if(err) return next(err);
      rtnQuery(req, res, _rtnValue);
    })
  }
  
};

function rtnQuery(req, res, _rtnValue) {
  logger.debug('[gd] _rtnValue >>> %j', _rtnValue);

  res.status(200);
  res.json({
    updatedToken  : req.body.rtnValue.updatedToken,
    token         : req.body.rtnValue.token,
    result        : _rtnValue
  });
}

module.exports = gd;