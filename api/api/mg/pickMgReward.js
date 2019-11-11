/**
 * pickMgReward : pickup mini game reward
 * Created by stub on 2017-09-25.
 */
"use strict";

var utils = require('../../constants/utils');
var kikis = require('../../constants/kikis');

var async = require('async');
var moment = require('moment');

var pickMgReward = {
  execute : function(req, res, callback) {
    return execute(req, res, callback);
  }
};

const sequelize = utils.createConnection();

function execute(req, res, callback) {
  logger.debug('---pickMgReward START---');

  var appId  = (req.params && req.params.appId) || (req.body && req.body.appId) || (req.query && req.query.appId) || req.headers['x-appId']; // "app_ZCmrndUg00000";
  var mgId   = (req.params && req.params.mgId) || (req.body && req.body.mgId) || (req.query && req.query.mgId) || req.headers['x-mgId']; // "act_ijPomTe700000";
  var userId = (req.params && req.params.userId) || (req.body && req.body.userId) || (req.query && req.query.userId) || req.headers['x-userId'];

  var userIP = (req.params && req.params.userIP) || (req.body && req.body.userIP) || (req.query && req.query.userIP) || req.headers['x-userIP'];
  // var userIP = utils.getUserIP(req);
  logger.debug('userIP ::: %j', userIP);

  if (!appId || !mgId || !userId) {
    var errorMessage = 'appId, userId, mgId required';
    logger.error(errorMessage);
    return callback(errorMessage);
  }

  var opts = {
    kiki : {
      appId : appId,
      mgId : mgId,
      userId : userId
    }
  };

  const MgSt  = sequelize.import('../../models/mg_st');
  const User = sequelize.import('../../models/user');
  const MgLog = sequelize.import('../../models/mg_log');
  const MileageUseLog = sequelize.import('../../models/mileage_uselog');
  const Application = sequelize.import('../../models/application');
  const MgExtLog = sequelize.import('../../models/mg_extlog');

  let rtnValue = {
    rwdId : '',
    rwdName : ''
  };

  // 01. mainId에 해당하는 리워드 정보 확인
  // -> mainId의 시작일-종료일에 대한 유효성 검사
  // -> 리워드 정보가 있는지 여부 확인
  //
  // 02. 확률값을 생성하여 선택된 리워드 확인
  //
  // 03. 리워드 Type이 'G' 기프티콘인 경우 -> 당첨제한수가 있는 경우
  // 기프티콘 당첨시간을 조회하여 현재시간에 당첨시간이 존재하는지 비교
  // 존재하면 당청잠정보 mg_st 테이블에 업데이트 및 리턴 값 생성
  // 존재하지 않으면 리워드 확률중 가장 확률이 큰 값을 리턴 값을 설정
  //
  // 04. 리워드 정보 로그 기록 생성하고 결과 값 리턴
  //

  sequelize.transaction().then(function(t) {

    let m_mgMain = null;
    // let m_logInfos = null;
    let m_contCnt = 1;
    let m_contMinIdx = 0;
    let m_contMaxIdx = 0;

    let rwdNames = [], rwdProbs = [], rwdIds = [], rwdTypes = [], rwdValues = [], rwdPrices = [], couponLinkUrls = [], mileageTexts = [], unitTexts = [];
    let defaultIdx = 0;

    let isReserved = false;

    async.waterfall(
      [
        // select reward info and rewards history
        function (callback) {
          kikis.getRewardInfos(opts, function(err, results) {
            if(err) callback(err);
            else { m_mgMain = results.m_mgMain; m_contCnt = results.m_contCnt; callback(null); }
          });
        },

        // select rewards infos
        function (callback) {
          kikis.selectRewardInfos(opts, function(err, results) {
            if(err) callback(err);
            else {
              m_contMinIdx = results.m_contMinIdx; m_contMaxIdx = results.m_contMaxIdx;
              rwdNames = results.rwdNames; rwdProbs = results.rwdProbs; rwdIds = results.rwdIds; rwdTypes = results.rwdTypes;
              rwdValues = results.rwdValues; rwdPrices = results.rwdPrices; defaultIdx = results.defaultIdx; couponLinkUrls = results.couponLinkUrls;
              mileageTexts = results.mileageTexts; unitTexts = results.unitTexts;
              callback(null, results.rwdInfos)
            }
          });
        },

        function (rwdInfos, callback) {
          var pProb = 0.0;
          if(utils.initRandomReal(0,1,1000))
            pProb = utils.getRandomReal();

          logger.info('pProb ::: %j, rwdNames ::: %j, rwdProbs ::: %j', pProb, rwdNames, rwdProbs);
          callback(null, rwdInfos, pProb);
        },

        function(rwdInfos, pProb, callback) {
          // logger.debug('pProb ::: %j, rwdProbs.length ::: %j', pProb, rwdProbs.length);

          // TODO. get weightedValue from DB
          // temp. wValue = 2
          let wValue = 1;

          let sumProbs = 0.0;
          for (let i=rwdProbs.length-1; i>=0; i--) {
            sumProbs += rwdProbs[i];
          }

          if (sumProbs == 0.0) {
            callback('rewards information does not exist.');
          }

          let tNumber = pProb * sumProbs * wValue;
          logger.info('tNumber ::: %j, sumProbs ::: %j', tNumber, sumProbs);

          sumProbs = 0.0;
          for (let i=rwdProbs.length-1; i>=0; i--) {
            // logger.debug('pProb ::: %j, rwdProbs[i] ::: %j', pProb, rwdProbs[i]);
            sumProbs += rwdProbs[i];
            // logger.debug('tNumber ::: %j, sumProbs ::: %j', tNumber, sumProbs);
            if(tNumber <= sumProbs) {
              return callback(null, rwdInfos, i);
            }
          }
          return callback(null, rwdInfos, 0);
        },

        function(rwdInfos, sIdx, callback) {
          // logger.debug('rwdInfos ::: %j', rwdInfos);
          // logger.debug('rwdInfos[%j].dataValues.rwdType ::: %j', sIdx, rwdInfos[sIdx].dataValues.rwdType);
          // if (rwdInfos[sIdx].dataValues.rwdType === 'G') {
          logger.debug('rwdInfos[%j].dataValues.rwdRestrict ::: %j', sIdx, rwdInfos[sIdx].dataValues.rwdRestrict);
          logger.debug('rwdInfos[%j].dataValues.rwdRestrict === \'\' ::: %j', sIdx, !(rwdInfos[sIdx].dataValues.rwdRestrict === ''));
          if (!rwdInfos[sIdx].dataValues.rwdRestrict && !(rwdInfos[sIdx].dataValues.rwdRestrict === '') || (rwdInfos[sIdx].dataValues.rwdRestrict != 0)) {
            let currentHour = moment().format('YYYYMMDDHH');
            let currentDay = moment().format('YYYYMMDD');
            let getCurrentHourST = 'SELECT * FROM mg_st WHERE DATE_FORMAT(stYHS, "%Y%m%d") = ' + currentDay + ' AND DATE_FORMAT(stYHS, "%Y%m%d%H") <= ' + currentHour;
               getCurrentHourST += ' AND selectedUserId is NULL AND rwdId = \'' + rwdInfos[sIdx].dataValues.rwdId + '\' ORDER BY stYHS ASC ';

            logger.debug('getCurrentHourST ::: %j', getCurrentHourST);

            sequelize.query(getCurrentHourST)
            // sequelize.query(getCurrentHourST, {transaction : t})
            .spread(function(stInfos) {
              logger.debug('stInfos.length ::: %j', stInfos.length);
              if (stInfos.length > 0) {
                callback(null, sIdx, stInfos[0])
              } else {
                callback(null, defaultIdx, null);
              }
            }, function(err) { logger.error('stInfos.err ::: %j', err); callback(err); });
          } else { callback(null, sIdx, null); }
        },

        function(sIdx, updateStInfo, callback) {
          if (updateStInfo != null) {
            logger.debug('updateStInfo ::: %j', updateStInfo);
            return MgSt.update({
                selectedUserId: userId,
                selectedYHS: new Date()
              }, {
              where: { mgStSerno: updateStInfo.mgStSerno },
              transaction: t
            })
            .then(mgSt => { isReserved = true; logger.info('mgSt.update.success ::: %j', mgSt); callback(null, sIdx); })
            .catch(err => { logger.error('mgSt.update.err :: %j', err); callback(err); })
          } else callback(null, sIdx);
        },

        function(sIdx, callback) {
          let tmpRwdValue = [], tmpRwdTitle = [], tmpRwdId = [], tmpRwdType = [], tmpRwdPrices = [], tmpCouponLinkUrl = [], tmpMileageTexts = [], tmpUnitTexts = [];
          logger.debug('m_mgMain[0].mgType ::: %j', m_mgMain[0].mgType);
          if (m_mgMain[0].mgType == 'D') {
            // tmpRwdValue = rwdValues[m_contMinIdx]; tmpRwdTitle = rwdNames[m_contMinIdx] + '회 출첵'; tmpRwdId = rwdIds[m_contMinIdx]; tmpRwdType = rwdTypes[m_contMinIdx];
            tmpRwdValue.push(rwdValues[m_contMinIdx]);
            tmpRwdTitle.push(rwdNames[m_contMinIdx] + '회 출첵');
            tmpRwdId.push(rwdIds[m_contMinIdx]);
            tmpRwdType.push(rwdTypes[m_contMinIdx]);
            tmpRwdPrices.push(rwdPrices[m_contMinIdx]);
            tmpCouponLinkUrl.push(couponLinkUrls[m_contMinIdx]);
            tmpMileageTexts.push(mileageTexts[m_contMinIdx]);
            tmpUnitTexts.push(unitTexts[m_contMinIdx]);
            // logger.debug('tmpRwdValue ::: %j, tmpRwdTitle ::: %j, tmpRwdId ::: %j', tmpRwdValue, tmpRwdTitle, tmpRwdId);
            for (let i=1; i<rwdNames.length; i++) {
              if (rwdNames[i] == m_contCnt) {
                logger.debug('rwdNames[i] ::: %j, rwdValues[i] ::: %j', rwdNames[i], rwdValues[i]);
                tmpRwdValue.push(rwdValues[i]);
                tmpRwdTitle.push(rwdNames[i] + '회 연속 출첵');
                tmpRwdId.push(rwdIds[i]);
                tmpRwdType.push(rwdTypes[i]);
                tmpRwdPrices.push(rwdPrices[i]);
                tmpCouponLinkUrl.push(couponLinkUrls[i]);
                tmpMileageTexts.push(mileageTexts[i]);
                tmpUnitTexts.push(unitTexts[i]);
                    logger.debug('i ::: %j, m_contMaxIdx ::: %j', i, m_contMaxIdx);
                if (i == m_contMaxIdx) m_contCnt = 0;
                // logger.debug('tmpRwdValue ::: %j, tmpRwdTitle ::: %j, tmpRwdId ::: %j, m_contCnt ::: %j', tmpRwdValue, tmpRwdTitle, tmpRwdId, m_contCnt);
              }
            }
          } else {
            // tmpRwdValue = rwdValues[sIdx];
            tmpRwdValue.push(rwdValues[sIdx]);
            tmpRwdTitle.push(rwdNames[sIdx]);
            tmpRwdId.push(rwdIds[sIdx]);
            tmpRwdType.push(rwdTypes[sIdx]);
            tmpRwdPrices.push(rwdPrices[sIdx]);
            tmpCouponLinkUrl.push(couponLinkUrls[sIdx]);
            tmpMileageTexts.push(mileageTexts[sIdx]);
            tmpUnitTexts.push(unitTexts[sIdx]);
          }
          logger.debug('tmpRwdValue : %j, tmpRwdTitle : %j, tmpRwdId : %j, tmpRwdType : %j, tmpRwdPrices : %j, tmpCouponLinkUrl : %j, m_contCnt ::: %j',
            tmpRwdValue, tmpRwdTitle, tmpRwdId, tmpRwdType, tmpRwdPrices, tmpCouponLinkUrl, m_contCnt);

          let tmpRwds = [];
          for (let i=0; i<tmpRwdValue.length; i++) {
            let tmpRwd = {
              tmpRwdValue  : tmpRwdValue[i],
              tmpRwdTitle  : tmpRwdTitle[i],
              tmpRwdId     : tmpRwdId[i],
              tmpRwdType   : tmpRwdType[i],
              tmpRwdPrices : tmpRwdPrices[i],
              tmpCouponLinkUrl : tmpCouponLinkUrl[i],
              tmpMileageTexts : tmpMileageTexts[i],
              tmpUnitTexts : tmpUnitTexts[i],
            };
            tmpRwds.push(tmpRwd);
          }
          logger.debug('tmpRwds ::: %j', tmpRwds);

          rtnValue.rwdName = tmpRwdTitle[tmpRwdTitle.length-1];
          rtnValue.rwdId = tmpRwdId[tmpRwdId.length-1];
          rtnValue.rwdValue = tmpRwdValue[tmpRwdValue.length-1];
          rtnValue.rwdTitle = tmpRwdTitle[tmpRwdTitle.length-1];
          rtnValue.rwdType = tmpRwdType[tmpRwdType.length-1];
          rtnValue.couponLinkUrl = tmpCouponLinkUrl[tmpCouponLinkUrl.length-1];
          rtnValue.description = m_mgMain[0].description;
          rtnValue.mileageText = tmpMileageTexts[tmpMileageTexts.length-1];
          rtnValue.unitText = tmpUnitTexts[tmpUnitTexts.length-1];
          logger.debug('rtnValue ::: %j', rtnValue);

          async.each(tmpRwds, function(tmpRwd, next) {
            let errorMsg = null;
            let mgLogData = {
              mgId      : mgId,
              rwdId     : tmpRwd.tmpRwdId,
              userId    : userId,
              regYHS    : new Date(),
              IP        : userIP,
              appId     : appId,
              rwdTitle  : tmpRwd.tmpRwdTitle,
              rwdValue  : tmpRwd.tmpRwdValue,
              rwdPrice  : tmpRwd.tmpRwdPrices,
              rwdType   : tmpRwd.tmpRwdType,
              contCnt   : m_contCnt
            };
            return MgLog.create(mgLogData, { transaction: t })
            .then(mgLog => {
              logger.info('mgLog.create success %j', mgLog);
              if (tmpRwd.tmpRwdType === 'P') {
                  return User.findOne( { where: { userId: userId, appId: appId }, transaction: t } )
                  .then(userInfo => {
                    logger.debug('userInfo.findOne success ::: %j', userInfo.dataValues);
                    let updatedMileage = Number(userInfo.dataValues.userMileage)+Number(tmpRwd.tmpRwdValue);
                    let mileageUseLogData = {
                      appId       : appId,
                      userId      : userId,
                      mileage     : tmpRwd.tmpRwdValue,
                      chk         : 'G',
                      comments    : 'ChanceGame',
                      sign1       : 'A',
                      balanMileage: updatedMileage,
                      mgId        : mgId,
                      rwdId       : tmpRwd.tmpRwdId,
                      rwdTitle    : tmpRwd.tmpRwdTitle,
                      rwdValue    : tmpRwd.tmpRwdValue
                    };
                    return User.update( { userMileage: updatedMileage }, {
                      where: { userId: userId, appId: appId },
                      transaction: t
                    })
                    .then(userUpdate => {
                      logger.info('userUpdate success ::: %j', userUpdate);
                      return MileageUseLog.create( mileageUseLogData, { transaction: t } )
                      .then(mileageUseLog => {
                        logger.info('mileage use log create success ::: %j', mileageUseLog);
                      })
                      .catch(err => { errorMsg = 'mileage use log create fail ::: ' + err; logger.error(errorMsg); })
                      .finally(function() {
                        if (errorMsg == null) next();
                        else { logger.debug('errorMsg ::: %j', errorMsg); next(errorMsg); }
                      })
                    })
                    .catch(err => { errorMsg = 'userUpdate fail ::: ' + err; logger.error(errorMsg); next(errorMsg); });
                  })
                  .catch(err => { errorMsg = 'userInfo.findOne fail ::: ' + err; logger.error(errorMsg); next(errorMsg); });
              } else if (tmpRwd.tmpRwdType === 'G' && !isReserved) {
                let prefix = 'MGSTS_';
                let mgStData = {
                  stId          : utils.getUniqueID(prefix),
                  mgId          : mgId,
                  rwdId         : tmpRwd.tmpRwdId,
                  rwdTitle      : tmpRwd.tmpRwdTitle,
                  rwdValue      : tmpRwd.tmpRwdValue,
                  rwdPrice      : tmpRwd.tmpRwdPrices,
                  rwdType       : tmpRwd.tmpRwdType,
                  appId         : appId,
                  stYHS         : new Date(),
                  selectedUserId: userId,
                  selectedYHS   : new Date()
                };
                MgSt.create( mgStData, { transaction: t } )
                .then(mgStResult => {
                  logger.info('mg_st data create success ::: %j', mgStResult);
                })
                .catch(err => {
                  errorMsg = 'mg_st data create fail ::: ' + err; logger.error(errorMsg);
                })
                .finally(function() {
                  if (errorMsg == null) next();
                  else {
                    logger.debug('errorMsg ::: %j', errorMsg); next(errorMsg);
                  }
                })
              } else next();
            })
            .catch(err => { errorMsg = 'mgLog.create fail ::: ' + err; logger.error(errorMsg); next(errorMsg); })
          }, function(err) {
            if (err) callback(err);
            else callback(null, tmpRwds, sIdx);
          });

        },

        function(tmpRwds, sIdx, callback) {
            return MgLog.findAll({ where: {
                regYHS: {gt: sequelize.fn('CURRENT_DATE')}, userId: userId, mgId: mgId
              },
              order: [['regYHS','DESC']],
              transaction: t
            })
            .then(logInfos => {
              let errorMessage = null;
              // 미니게임 실행제한이 단회('A')인 경우
              if (m_mgMain[0].mgRestrict == 'A') {
                if (logInfos.length > 1) errorMessage='user('+userId+') already joined';
                else errorMessage = null;
              }
              else if (logInfos.length < ((m_mgMain[0].mgRestrict*1)+tmpRwds.length)) errorMessage = null;
              else errorMessage='user('+userId+') already joined today';

              logger.debug('errorMessage ::: %j', errorMessage);

              if (errorMessage == null ) {
                async.each(tmpRwds, function(tmpRwd, next) {
                  logger.debug('---call application.findOne---');
                  // external API 여부 확인 후 external API call
                  return Application.findOne({ where: { appId: appId }, transaction: t })
                  .then(appInfo => {
                    logger.debug('appInfo ::: %j', appInfo.dataValues);
                    // logger.debug('appInfo.dataValues.apiUrl ::: %j, appInfo.dataValues.gk_key ::: %j, appInfo.dataValues.gk_secret ::: %j',
                    //   appInfo.dataValues.apiUrl, appInfo.dataValues.gk_key, appInfo.dataValues.gk_secret);
                    if ( appInfo != null &&
                        (appInfo.dataValues.apiYN == 'Y' ||
                        (appInfo.dataValues.pluginType == 'C24' && tmpRwd.tmpRwdType != 'G' && tmpRwd.tmpRwdType != 'E')) ) {
                    // if (appInfo != null && appInfo.dataValues.apiUrl != null &&
                    //     appInfo.dataValues.gk_key != null && appInfo.dataValues.gk_secret != null) {
                      let apiUrl = '';
                      if (appInfo.dataValues.pluginType == 'C24' && tmpRwd.tmpRwdType === 'P')
                        apiUrl = 'https://' + appInfo.dataValues.developerId + '.cafe24api.com/api/v2/admin/mileage'
                      else if (appInfo.dataValues.pluginType == 'C24' && tmpRwd.tmpRwdType === 'C')
                        apiUrl = 'https://' + appInfo.dataValues.developerId + '.cafe24api.com/api/v2/admin/coupons/'
                      else apiUrl = appInfo.dataValues.apiUrl;
                      let opts = {
                        gk_key        : appInfo.dataValues.gk_key,
                        gk_secret     : appInfo.dataValues.gk_secret,
                        hostId        : appInfo.dataValues.hostId,
                        mgId          : mgId,
                        userId        : userId,
                        appId         : appId,
                        rwdType       : tmpRwd.tmpRwdType,
                        rwdValue      : tmpRwd.tmpRwdValue,
                        title         : m_mgMain[0].title,
                        couponLinkUrl : tmpRwd.tmpCouponLinkUrl,
                        pluginType    : appInfo.dataValues.pluginType,
                      };
                      logger.debug('apiUrl ::: %j, opts ::: %j', apiUrl, opts);
                      utils.externalAPI(apiUrl, opts, function(err, result) {
                        let mgExtLog = {
                           appId        : appId,
                           userId       : userId,
                           rwdValue     : tmpRwd.tmpRwdValue,
                           rwdType      : tmpRwd.tmpRwdType,
                           couponLinkUrl: tmpRwd.tmpCouponLinkUrl,
                           mgId         : mgId,
                           mgTitle      : m_mgMain[0].title,
                           extUrl       : apiUrl,
                           extGkKey     : appInfo.dataValues.gk_key,
                           extGkSecret  : appInfo.dataValues.gk_secret,
                           extHostId    : appInfo.dataValues.hostId,
                           extResultYN  : 'N',
                           pluginType   : appInfo.dataValues.pluginType,
                           extLogMsg    : ''
                        };
                        if (err || result.success == 'false') {
                          logger.error('err > ', err);
                          logger.error('error result > ', result);
                          let logMsg = err ? err : result.error.code + ':' + result.error.message;
                          mgExtLog.extLogMsg = logMsg;
                          logger.error('mgExtLog > %j', mgExtLog);
                          // return MgExtLog.create( mgExtLog, { transaction: t } )
                          return MgExtLog.create( mgExtLog )
                          .then(mgExtLog => { logger.debug('MgExtLog.create.errorlog.success > %j', mgExtLog); })
                          .catch(err => { logger.error('MgExtLog.create.errorlog.fail > ', err); }) // callback(errorMessage); })
                          .finally(function() { let errorMessage = 'external API error(' + logMsg + ')';  next(errorMessage); }); // callback(errorMessage); });
                        } else {
                          mgExtLog.extResultYN = 'Y';
                          logger.debug('mgExtLog > ', mgExtLog);
                          return MgExtLog.create( mgExtLog, { transaction: t } )
                          .then(mgExtLog => { logger.debug('MgExtLog.create.successlog.success > ', mgExtLog); })
                          .catch(err => { logger.error('MgExtLog.create.successlog.fail > ', err); }) // callback(errorMessage); })
                          .finally(function() { next(); });
                        }
                      });
                    } else next();
                  })
                  .catch(err => { logger.error('appInfo.err ::: %j', err); next(err); });
                }, function(err) {
                  if (err) callback(err);
                  else callback(null, sIdx);
                }); // end. async.each()
              } else callback(errorMessage);
            })
            .catch(err => { logger.error('logInfos.err ::: %j', err); callback(err); });

        }
      ],

      function (err, sIdx) {
        if (err) { callback(err); return t.rollback(); }
        else {
          // rtnValue.rwdName = rwdNames[sIdx];
          // rtnValue.rwdId = rwdIds[sIdx];
          logger.debug('rtnValue ::: %j', rtnValue);

          callback(null, rtnValue);

          logger.debug('---pickMgReward END---');

          // sequelize.close();
          return t.commit();
        }

        sequelize.close();
      }
    ); // end waterfall
  }); // END sequelize.transaction(t)

}

module.exports = pickMgReward;