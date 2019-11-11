/**
 * tracklog : user widget tracking log
 *            gathering user tracking
 * Created by stub on 2017-10-25.
 * Updated by stub at 2019-08-27.
 */
"use strict";

var utils = require('../../constants/utils');
var async = require('async');

var tracklog = {
  execute : function(req, res, callback) {
    return execute(req, res, callback);
  }
};

function execute(req, res, callback) {
  logger.debug('---tracklog START---');

  var appId = (req.params && req.params.appId) || (req.body && req.body.appId) || (req.query && req.query.appId) || req.headers['x-appId'];
  var userId = (req.params && req.params.userId) || (req.body && req.body.userId) || (req.query && req.query.userId) || req.headers['x-userId'];
  var eventTyp = (req.params && req.params.eventTyp) || (req.body && req.body.eventTyp) || (req.query && req.query.eventTyp) || req.headers['x-eventTyp'];
  var eventId = (req.params && req.params.eventId) || (req.body && req.body.eventId) || (req.query && req.query.eventId) || req.headers['x-eventId'];
  var eventChk = (req.params && req.params.eventChk) || (req.body && req.body.eventChk) || (req.query && req.query.eventChk) || req.headers['x-eventChk'];
  var todayNumb = (req.params && req.params.todayNumb) || (req.body && req.body.todayNumb) || (req.query && req.query.todayNumb) || req.headers['x-todayNumb'];
  var contNumb = (req.params && req.params.contNumb) || (req.body && req.body.contNumb) || (req.query && req.query.contNumb) || req.headers['x-contNumb'];
  var playcount = (req.params && req.params.playcount) || (req.body && req.body.playcount) || (req.query && req.query.playcount) || req.headers['x-playcount'];
  var userAgent = (req.params && req.params.userAgent) || (req.body && req.body.userAgent) || (req.query && req.query.userAgent) || req.headers['x-userAgent'];
  var mgType = (req.params && req.params.mgType) || (req.body && req.body.mgType) || (req.query && req.query.mgType) || req.headers['x-mgType'];

  var userIP = (req.params && req.params.userIP) || (req.body && req.body.userIP) || (req.query && req.query.userIP) || req.headers['x-userIP'];
  // var userIP = utils.getUserIP(req);
  logger.debug('userIP ::: %j', userIP);

  if (!appId || !userId || !eventTyp) {
    var errorMessage = 'appId, userId, eventTyp required';
    logger.error(errorMessage);
    return callback(errorMessage);
  }

  // could be TODO
  // 현재 입력값이 이전데이터 대비 유효한지에 대한 검증 로직이 추가될 수 있음

  // eventTyp (G:minigame, P:product, D:dashboard)
  // eventId (G->mgId, P->prodId)
  // eventChk (L:노출, C:클릭)
  if (eventTyp === 'G' || eventTyp === 'P') {
    if (!eventId || !eventChk || !todayNumb || !contNumb) {
      var errorMessage = 'eventId, eventChk, todayNumb, contNumb, playcount required';
      logger.error(errorMessage);
      return callback(errorMessage);
    }
  }

  if (eventId == 'no data') {
    var message = 'tracklog.skipped.with.no.data';
    logger.debug(message);
    return callback(null, message);
  }

  const sequelize = utils.createConnection();
  const WgTracking = sequelize.import('../../models/wg_tracking');

  WgTracking.create({
    appId: appId,
    userId: userId,
    eventChk: eventChk,
    todayNumb: todayNumb,
    contNumb: contNumb,
    eventTyp: eventTyp,
    eventId: eventId,
    playcount: playcount,
    IP: userIP,
    userAgent: userAgent,
    mgType: mgType
  })
  .then(wgTraking => {
    logger.debug('wgTraking.create.success ::: %j', wgTraking);
    callback(null, 'success');

    logger.debug('---tracklog END---');
    sequelize.close();
  })
  .catch(err => {
    logger.error(err);

    callback(err);
    sequelize.close();
  })

  return;
}

module.exports = tracklog;
