/**
 * sugprod : sugguest product
 * Created by stub on 2017-10-24.
 */

"use strict";

var utils = require('../../constants/utils');
var async = require('async');

var sugprod = {
  execute : function(req, res, callback) {
    return execute(req, res, callback);
  }
};

function execute(req, res, callback) {
  logger.debug('---sugprod START---');

  var appId = (req.params && req.params.appId) || (req.body && req.body.appId) || (req.query && req.query.appId) || req.headers['x-appId'];
  var userId = (req.params && req.params.userId) || (req.body && req.body.userId) || (req.query && req.query.userId) || req.headers['x-userId'];

  var userIP = (req.params && req.params.userIP) || (req.body && req.body.userIP) || (req.query && req.query.userIP) || req.headers['x-userIP'];
  // var userIP = utils.getUserIP(req);
  logger.debug('userIP ::: %j', userIP);

  logger.debug('appId ::: %j, userId ::: %j', appId, userId);

  if (!appId || !userId) {
    var errorMessage = 'appId, userId required';
    logger.error(errorMessage);
    return callback(errorMessage);
  }

  // 01. 로그인한 사용자의 저장된 kword 중 많은 것 select
  // 02. 해당 kword로 노출된 prodId 이력을 확인
  // 03. gd_product에 저장된 상품 중 kword로 상품검색 후 최신순으로 정렬하고 02.에서 확인된 prodId 제외한 최상위 상품정보 전송
  // 03-1. kword로 상품검색 후 검색된 상품이 존재하지 않는다면? -> keyword 없을 때 조건으로 검색
  // 03-2. kword가 , 로 구분되어 여러개인 경우는?

  const sequelize = utils.createConnection();
  const GdLog = sequelize.import('../../models/gd_log');
  const WgTracking = sequelize.import('../../models/wg_tracking');
  const GdProd = sequelize.import('../../models/gd_prod');

  let prevProdIds = [];
  
  async.waterfall(
  [
    // 01. userId 로 저장된 kword 중 많은 것 kword select
    function(callback) {
      GdLog.findOne({
        attributes: [
          'userId', 'kword',
          [sequelize.literal('COUNT(kword)'), 'count']
        ],
        where: { userId: userId, appId: appId },
        group: 'kword',
        order: [[sequelize.literal('count'), 'DESC']]
      })
      .then(gdLog => {
        logger.debug('gdLog.findeOne.success ::: %j', gdLog);
        if (gdLog == null || gdLog.length < 1) callback(null, null);
        else callback(null, gdLog.kword);
      })
      .catch(err => {
        logger.error('gdLog.findOne.err ::: %j', err);
        callback(err);
      });
    },

    // 02. 사용자에게 노출된 prodId 이력 확인
    function(userKword, callback) {
      WgTracking.findAll({
        attributes: [['eventId', 'prodId']],
        where: { 'userId': userId, 'eventTyp': 'P', 'eventChk': 'L', appId: appId,
                  regiYHS: {gt: sequelize.fn('CURRENT_DATE')} }
      })
      .then(wgTracking => {
        logger.debug('WgTracking.findAll.success ::: %j', wgTracking);
        if (wgTracking.length > 0) {
          for (let i=0; i<wgTracking.length; i++)
            prevProdIds.push(wgTracking[i].dataValues.prodId);
        }
        logger.debug('prevProdIds ::: %j', prevProdIds);
        callback(null, userKword, prevProdIds);
      })
      .catch(err => {
        logger.error('wgTracking.findAll.err ::: %j', err);
        callback(err);
      })
    },

    // 03. gd_prod 에서 kword로 추천상품 검색, 노출된 상품은 제외
    function(userKword, prodIds, callback) {
      if (userKword == null) {
        GdProd.findOne({
          attributes: [
            'prodId', 'prodImgUrl', 'prodUrl', 'prodName', 'prodPrice'
          ],
          where: {
            prodId: { $notIn: prodIds },
            prodQty: { $gt: 0 },
            appId: appId,
            listFlag: 'Y',
          },
          order: [['regYHS', 'DESC']]
        })
        .then(gdProd => {
          if (!gdProd) {
            var errorMessage = 'no more suggested product information.';
            logger.debug(errorMessage);
            callback(null, errorMessage);
          } else {
            logger.debug('gdProd.findOne.success ::: %j', gdProd);
            callback(null, gdProd);
          }
        })
        .catch(err => {
          logger.error('gdProd.findOne.err ::: %j', err);
          callback(err);
        })
      } else {
        GdProd.findOne({
          attributes: [
            'prodId', 'prodImgUrl', 'prodUrl', 'prodName', 'prodPrice'
          ],
          where: {
            kword: userKword,
            prodId: { $notIn: prodIds },
            prodQty: { $gt: 0 },
            appId: appId,
            listFlag: 'Y',
          },
          order: [['regYHS', 'DESC']]
        })
        .then(gdProd => {
          if (!gdProd) {
            GdProd.findOne({
              attributes: [
                'prodId', 'prodImgUrl', 'prodUrl', 'prodName', 'prodPrice'
              ],
              where: {
                prodId: { $notIn: prodIds },
                prodQty: { $gt: 0 },
                appId: appId,
                listFlag: 'Y',
              },
              order: [['regYHS', 'DESC']]
            })
            .then(gdProd => {
              if (!gdProd) {
                var errorMessage = 'no more suggested product information.';
                logger.debug(errorMessage);
                callback(null, errorMessage);
              } else {
                logger.debug('gdProd.findOne.success ::: %j', gdProd);
                callback(null, gdProd);
              }
            })
            .catch(err => {
              logger.error('gdProd.findOne.err ::: %j', err);
              callback(err);
            })
           } else {
            logger.debug('gdProd.findOne.success ::: %j', gdProd);
            callback(null, gdProd);
         }
        })
        .catch(err => {
          logger.error('gdProd.findOne.err ::: %j', err);
          callback(err);
        })
      }
    }
  ],

    function (err, rtnValue) {      
      if (err) return callback(err);
      else {
        sequelize.close();
        logger.debug('---sugprod END---');
        return callback(null, rtnValue);
      }
    }

  ); // end waterfall

}

module.exports = sugprod;
