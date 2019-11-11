"use strict";

var kikis = {

  genToken: function(kikiOpts, next) {
    genToken(kikiOpts, function(err, rtnValue) {
      if(err) return next(err);
      return next(null, rtnValue);
    })
  },

  endToken: function(kikiOpts, next) {
    endToken(kikiOpts, function(err, rtnValue) {
      if(err) return next(err);
      return next(null, rtnValue);
    })
  },

  genUser: function(kikiOpts, next) {
    genUser(kikiOpts, function(err, rtnValue) {
      if(err) return next(err);
      return next(null, rtnValue);
    })
  },

  getRewardInfos: function(opts, next) {
    getRewardInfos(opts, function(err, rtnValue) {
      if(err) return next(err);
      return next(null, rtnValue);
    })
  },

  selectRewardInfos: function(opts, next) {
    selectRewardInfos(opts, function(err, rtnValue) {
      if(err) return next(err);
      return next(null, rtnValue);
    })
  },
}

var jwt   = require('jwt-simple');
let utils = require('./utils');

function genToken(kikiOpts, next) {
  let sequelize = utils.createConnection();
  var moment = require('moment');
  var regDate = moment().format('YYYY-MM-DD HH:mm:ss.SSS');

  var payload = {
    'appId'   : kikiOpts.appId,
    'userId'  : kikiOpts.userId,
    'exp'     : expiresIn(1),
    'regDate' : regDate
  };

  logger.debug('payload ::: %j, kikiOpts ::: %j', payload, kikiOpts);
  var token = getToken(payload, kikiOpts.secretKey);
  logger.debug('generated token >>> %j', token);

  let UserLoginlog = sequelize.import('../models/user_loginlog');

  let userLoginInfo = {
    'loginToken'  : token,
    'userId'      : kikiOpts.userId,
    'logindate'   : regDate,
    'expiredYN'   : 'N',
    'loginType'   : kikiOpts.loginType,
    'UserIp'      : kikiOpts.userIp,
    'appId'       : kikiOpts.appId,
    'accCountry'  : '',
    'accCity'     : ''
  };

  logger.debug('kikis.genToken.userLoginlog.userLoginInfo ::: %j', userLoginInfo);
  UserLoginlog.create(userLoginInfo)
  .then(userLoginlog => {
    logger.debug('userLoginlog.create.success ::: %j', userLoginlog);
    sequelize.close();

    return next(null, token);
  })
  .catch(err => {
    logger.error(err);
    sequelize.close();

    return next(err);
  })
}

function endToken(kikiOpts, next) {
  let sequelize = utils.createConnection();
  let UserLoginlog = sequelize.import('../models/user_loginlog');

  UserLoginlog.findOne({
    where: { loginToken: kikiOpts.token }
  })
  .then(userLoginlogInfo => {
    logger.debug('userLoginlogInfo.findOne.success ::: %j', userLoginlogInfo);
    UserLoginlog.update({
      expiredYN: "Y"
    }, {
      where: { loginToken: userLoginlogInfo.dataValues.loginToken }
    })
    .then(userLoginlogUpdate => {
      logger.debug('userLoginlogUpdate.update.success ::: %j', userLoginlogUpdate);
      next(null, userLoginlogInfo);
    })
    .catch(err => {
      logger.error(err);
      next(err);
    })
    .finally(function() { sequelize.close(); });
  })
  .catch(err => {
    logger.error(err);
    next(err);
  });
}

function getRewardInfos(opts, next) {
  logger.debug('opts ::: %j', opts);
  let sequelize = utils.createConnection();
  let moment = require('moment');

  let MgMain = sequelize.import('../models/mg_main');
  let MgLog = sequelize.import('../models/mg_log');

  let rtnValue = {};
  rtnValue.m_contCnt = 1;

  MgMain.findAll({
    where: {
      appId: opts.kiki.appId, mgId: opts.kiki.mgId, actYN: 'Y', delFlag: 'N',
      startYHS: {lte: sequelize.fn('CURRENT_DATE')},
      endYHS: {gte: sequelize.fn('CURRENT_DATE')}
    }
  })
  .then(mgMain => {
    rtnValue.m_mgMain = mgMain;
    logger.debug('mgMain.findAll.success ::: %j', mgMain);
    if (mgMain.length < 1) next('activated rewards information does not exist.');
    else {
      MgLog.findAll({
        where: {
          // regYHS: {gt: sequelize.fn('CURRENT_DATE')},
          regYHS: {gte: moment().subtract(1, 'days').format('YYYY-MM-DD')},
          userId: opts.kiki.userId,
          mgId: opts.kiki.mgId
        },
        order: [['regYHS','ASC']]
      })
      .then(logInfos => {
        if (logInfos != null && logInfos.length > 0) {
          let todayCnt = 0;
          for (let i=0; i<logInfos.length; i++) {
            if (moment(logInfos[i].regYHS).format('YYYY-MM-DD') == moment().format('YYYY-MM-DD')) todayCnt++;
          }
          logger.debug('todayCnt ::: %j', todayCnt);
          // m_logInfos = logInfos;
          logger.debug('moment(regYHS).format(YYYY-MM-DD) == moment().subtract(1,days).format(YYYY-MM-DD) ::: %j',
            (moment(logInfos[0].regYHS).format('YYYY-MM-DD') == moment().subtract(1,'days').format('YYYY-MM-DD')));

          if (moment(logInfos[0].regYHS).format('YYYY-MM-DD') == moment().subtract(1,'days').format('YYYY-MM-DD'))
            rtnValue.m_contCnt = logInfos[0].contCnt + 1;
          logger.debug('m_contCnt ::: %j', rtnValue.m_contCnt);

          // 미니게임 실행제한이 단회('A')인 경우
          if (mgMain[0].mgRestrict == 'A') {
            if (todayCnt > 0) { let errorMessage='user('+opts.kiki.userId+') already joined'; next(errorMessage); }
            else next(null, rtnValue);
          }
          else if (todayCnt < Number(mgMain[0].mgRestrict)*1) next(null, rtnValue);
          else { let errorMessage='user('+opts.kiki.userId+') already joined today'; next(errorMessage); }
        } else {
          next(null, rtnValue);
        }
      })
      .catch(err => { logger.error('logInfos.err ::: %j', err); next(err); })
      .finally(function() { sequelize.close(); });
    }
  })
  .catch(err => { logger.error('mgMain.findAll.err ::: %j', err); next(err); });
}

function selectRewardInfos(opts, next) {
  let sequelize = utils.createConnection();
  let MgSub = sequelize.import('../models/mg_sub');

  let rtnValue = {};
  rtnValue.rwdNames = [], rtnValue.rwdProbs = [], rtnValue.rwdIds = [], rtnValue.rwdTypes = [], rtnValue.rwdValues = [], rtnValue.rwdPrices = [];
  rtnValue.couponLinkUrls = [], rtnValue.mileageTexts = [], rtnValue.unitTexts = [];
  rtnValue.defaultIdx = 0;

  MgSub.findAll({
    where: { mgId: opts.kiki.mgId },
    order: [['rwdProb','DESC'],['rwdId','ASC']]
  })
  .then(_rwdInfos => {
    logger.debug('_rwdInfos.length ::: %j', _rwdInfos.length);
    if (_rwdInfos.length < 1) callback('rewards information does not exist.');
    else {
      let tmpP = 0, defaultP = 1000000;
      rtnValue.m_contMinIdx = 0, rtnValue.m_contMaxIdx = 0;
      let tmpRwdMinValue = 0, tmpRwdMaxValue = 0;
      for (let i=0; i<_rwdInfos.length; i++) {
        // logger.debug('_rwdInfos[%j].dataValues.rwdType[%j].rwdValue[%j]', i, _rwdInfos[i].dataValues.rwdType, _rwdInfos[i].dataValues.rwdValue);
        // logger.debug('defaultP ::: %j, defaultIdx ::: %j', defaultP, defaultIdx);
        if (_rwdInfos[i].dataValues.rwdType === 'P') {
          tmpP = Number(_rwdInfos[i].dataValues.rwdValue);
          // logger.debug('tmpP ::: %j, defaultP ::: %j, defaultIdx ::: %j', tmpP, defaultP, defaultIdx);
          if (tmpP < defaultP) { defaultP = tmpP; rtnValue.defaultIdx = i }
        }
        rtnValue.rwdNames.push(_rwdInfos[i].dataValues.rwdTitle);
        rtnValue.rwdProbs.push(_rwdInfos[i].dataValues.rwdProb);
        rtnValue.rwdIds.push(_rwdInfos[i].dataValues.rwdId);
        rtnValue.rwdTypes.push(_rwdInfos[i].dataValues.rwdType);
        rtnValue.rwdValues.push(_rwdInfos[i].dataValues.rwdValue);
        rtnValue.rwdPrices.push(_rwdInfos[i].dataValues.rwdPrice);
        rtnValue.mileageTexts.push(_rwdInfos[i].dataValues.mileageText);
        rtnValue.unitTexts.push(_rwdInfos[i].dataValues.unitText);
        rtnValue.couponLinkUrls.push(_rwdInfos[i].dataValues.couponLinkUrl);
        if (Number(tmpRwdMaxValue) < Number(_rwdInfos[i].dataValues.rwdValue)) {
          tmpRwdMaxValue = _rwdInfos[i].dataValues.rwdValue;
          rtnValue.m_contMaxIdx = i;
        } else if (Number(tmpRwdMinValue) > Number(_rwdInfos[i].dataValues.rwdValue)) {
          rtnValue.m_contMinIdx = i;
        }
      }
      logger.debug('m_contMinIdx ::: %j, m_contMaxIdx ::: %j', rtnValue.m_contMinIdx, rtnValue.m_contMaxIdx);
      rtnValue.rwdInfos = _rwdInfos;
      next(null, rtnValue);
    }
  })
  .catch(err => { console.log(err); logger.error('rwdInfos.err ::: %j', err); next(err); })
  .finally(function() { sequelize.close(); });
}

function genUser(kikiOpts, next) {
  let sequelize = utils.createConnection();

  var moment  = require('moment');
  var regDate = moment().format('YYYY-MM-DD HH:mm:ss.SSS');

  const User = sequelize.import('../models/user');

  var newUserInfo = {
    'userId'        : kikiOpts.userId,
    'appId'         : kikiOpts.appId,
    'userName'      : kikiOpts.userName,
    'regiYHS'       : regDate,
    'possessBadges' : 0,
    'userPoint'     : 0,
    'joinRoute'     : kikiOpts.joinRoute,
    'userIP'        : kikiOpts.userIP,
    'accCountry'    : '',
    'accCity'       : ''
  };

  User.create(newUserInfo)
  .then(user => {
    logger.debug('user.create.success ::: %j', user);
    next(null, "success");
  })
  .catch(err => {
    logger.error(err);
    next(err);
  })
  .finally(function() { sequelize.close(); });
}

function getToken(payload, secret) {
  return jwt.encode(payload, secret);
}

function expiresIn(numDays) {
  var dateObj = new Date();
  return dateObj.setDate(dateObj.getDate() + numDays);
}

module.exports = kikis;