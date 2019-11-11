"use strict";

var utils = {

  initRandom: function(randomMin, randomMax, randomInitCnt) {
    return initRandom(randomMin, randomMax, randomInitCnt);
  },

  initRandomInt: function(min, max, initCnt) {
    return initRandomInt(min, max, initCnt);
  },

  initRandomReal: function(min, max, initCnt) {
    return initRandomReal(min, max, initCnt);
  },

  getRandomInt: function() {
    return getRandomInt();
  },

  getRandomReal: function() {
    return getRandomReal();
  },

  getUniqueID: function(prefix) {
    return getUniqueID(prefix);
  },

  getCurrentDate: function() {
    return getCurrentDate();
  },

  upload: function(req, res) {
    return upload(req, res);
  },

  getUserIP: function(req) {
    return getUserIP(req);
  },

  createConnection: function() {
    return createConnection();
  },

  createOldConnection: function() {
    return createOldConnection();
  },

  externalAPI: function(extURL, opts, next) {
    extAPI(extURL, opts, function(err, rtnValue) {
      // logger.debug('err ::: %j, rtnValue ::: %j', err, rtnValue);
      if(err) return next(err);
      return next(null, rtnValue);
    })
  },

  getCafe24Token: function(req, res, next) {
    let appId = (req.params && req.params.appId) || (req.body && req.body.appId) || (req.query && req.query.appId) || req.headers['appId'];
    if (!appId) return next('appId required');
    getCafe24Token(appId, function(err, rtnValue) {
      logger.debug('err ::: %j, rtnValue ::: %j', err, rtnValue);
      if(err) return next(err);
      res.status(200);
      res.json({
        access_token : rtnValue
      });
    })
  }

}

const Random      = require("random-js");
const randomInt   = new Random(Random.engines.mt19937().autoSeed());
const randomReal  = new Random(Random.engines.mt19937().autoSeed());

var intMin = 0, intMax = 100, realMin = 0.0, realMax = 1.0;
var initRandomIntYN = false;
var initRandomRealYN = false;

function initRandomInt(min, max, initCnt) {
  intMin = min;
  intMax = max;
  for (let i = 0; i < initCnt; i++) {
    randomInt.integer(min, max);
  }
  initRandomIntYN = true;
  return true;
}

function initRandomReal(min, max, initCnt) {
  realMin = min;
  realMax = max;
  for (let i=0; i<initCnt; i++) {
    randomReal.real(min, max);
  }
  initRandomRealYN = true;
  return true;
}

function getRandomInt() {
  if (!initRandomIntYN)
    initRandomInt(intMin, intMax, 1000000);
  let rndNumber = randomInt.integer(intMin, intMax);

  rndNumber = (rndNumber < 10 ? "0" : "") + rndNumber;

  return rndNumber;
}

function getRandomReal() {
  logger.debug('initRandomRealYN ::: %j', initRandomRealYN);
  
  if (!initRandomRealYN)
    initRandomReal(realMin, realMax, 1000000);

  var rtnValue = randomReal.real(realMin, realMax);
  logger.debug('realMin ::: %j, realMax ::: %j, rtnValue ::: %j', realMin, realMax, rtnValue);

  return rtnValue;
}

function initRandom(_randomMin, _randomMax, _randomInitCnt) {
  randomMin     = _randomMin;
  randomMax     = _randomMax;
  randomInitCnt = _randomInitCnt;

  // below codes have some testing codes --- START
  var debugRandomCnt = [];
  var randVal;
  var fixedProb = 0.014; // 1.4% probability
  var matchCnt  = 0;
  for (var i = 0; i < randomInitCnt; i++) {
    // debugRandomCnt.push(random.integer(randomMin, randomMax));
    randVal = random.real(randomMin, randomMax);
    // console.log('random.real ::: ' + randVal);
    // console.log('random.real < fixProb ::: ' + (randVal<fixProb));
    if (randVal <= fixedProb) matchCnt++;
    // debugRandomCnt.push(random.real(randomMin, randomMax));
  }

  console.log('matchCnt ::: ' + matchCnt);
  // console.log('debugRandomCnt ::: ' + debugRandomCnt);
  // logger.debug('debugRandomCnt ::: %j', debugRandomCnt);
  // testing code --- END
  
  initialized = true;
  return true;
}

function getUniqueID(prefix) {
  var d = new Date().valueOf();
  var n = d.toString();
  var result = prefix;
  var length = 8;
  var p = 0;
  var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

  for (var i = length; i > 0; --i){
      result += ((i & 1) && n.charAt(p) ? n.charAt(p) : chars[Math.floor(Math.random() * chars.length)]);
      if(i & 1) p++;
  };

  console.log('getUniqueID result ::: ' + result);
  
  return result;

  // var date = new Date();
  // var rtnValue = prefix + date.toISOString().replace(/[^0-9]/g, "");
  // console.log('rtnValue ::: ' + rtnValue);

  // return rtnValue; 
}

function getCurrentDate() {
	var date = new Date();

  var hour = date.getHours();
  hour = (hour < 10 ? "0" : "") + hour;

  var min  = date.getMinutes();
  min = (min < 10 ? "0" : "") + min;

  var sec  = date.getSeconds();
  sec = (sec < 10 ? "0" : "") + sec;

  var year = date.getFullYear();

  var month = date.getMonth() + 1;
  month = (month < 10 ? "0" : "") + month;

  var day  = date.getDate();
  day = (day < 10 ? "0" : "") + day;

  return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;
}

function getUserIP(req) {
  var ipAddress;

  if(!!req.hasOwnProperty('sessionID')){
    ipAddress = req.headers['x-forwarded-for'];
  } else{
    if(!ipAddress){
      var forwardedIpsStr = req.header('x-forwarded-for');

      if(forwardedIpsStr){
        var forwardedIps = forwardedIpsStr.split(',');
        ipAddress = forwardedIps[0];
      }
      if(!ipAddress){
        ipAddress = req.connection.remoteAddress;
      }
    }
  }

  let idxColon = ipAddress.lastIndexOf(':');
  return ipAddress.substring(idxColon+1, ipAddress.length);
}

function createConnection() {
  let mode = config.mode;
  const Sequelize = require('sequelize');

  let sequelize;
  if (mode === 'live') {
    sequelize = new Sequelize(
      sequelConfig.production.database,
      sequelConfig.production.username,
      sequelConfig.production.password, {
        'host': sequelConfig.production.host,
        'port': sequelConfig.production.port,
        'dialect': sequelConfig.production.dialect,
        'timezone': '+09:00',
        'define': {
          timestamps: false
        },
        'logging': false,
        'pool': {
          max: 50,
          min: 0,
          // idle: 10000,
          // acquire: 20000
        }
      }
    );
  } else {
    sequelize = new Sequelize(
      sequelConfig.development.database,
      sequelConfig.development.username,
      sequelConfig.development.password, {
        'host': sequelConfig.development.host,
        'port': sequelConfig.development.port,
        'dialect': sequelConfig.development.dialect,
        'timezone': '+09:00',
        'dateStrings': true,
        'define': {
          timestamps: false
        },
        'pool': {
          max: 50,
          min: 0,
          // idle: 10000,
          // acquire: 20000
        }
      }
    );
  }

  return sequelize;
}

function createOldConnection() {
  const ss_conn = require('mysql');
  let mode = config.mode;

  if (mode === 'live')
    return ss_conn.createConnection(config.mysql_live);
  else
    return ss_conn.createConnection(config.mysql_dev);
}

function extAPI(extURL, opts, cb) {
  let result = { success : '', error : { code : '', message : '' } };

  let querystring = require('querystring');
  let request = require('request');
  let contentType = opts.pluginType == 'C24' ? 'application/json' : 'application/x-www-form-urlencoded';

  if (opts.pluginType == 'C24') {
    let memberId = opts.userId;
    let rwdType = opts.rwdType;
    let rwdValue = opts.rwdValue;
    let type = 'increase';
    let reason = 'GAMEKIKI ChanceGame : ' + opts.title;

    let reqData = {};

    if (rwdType === 'P') {
      reqData['request'] = {
        member_id: memberId,
        amount: rwdValue,
        type: type,
        reason: reason,
      };
    } else if (rwdType === 'C') {
      extURL = extURL + rwdValue + '/issue';
      reqData['request'] = {
        issued_member_scope: "M",
        member_id: memberId,
        send_sms_for_issue: "F",
      };
    } else return cb('rwdType required.'); 
    logger.debug('extURL > %j, reqData > %j', extURL, reqData);

    let accessToken = '';
    getCafe24Token(opts.appId, function(error, _accessToken) {
      if(error) { logger.debug('error > %j', error); return cb(error); }

      accessToken = _accessToken;
      logger.debug('reqData > %j, contentType > %j, accessToken > %j', reqData, contentType, accessToken);

      let options = {
        headers: {
          // 'Content-Length': contentLength,
          'Authorization': 'Bearer ' + accessToken,
          'Content-Type': contentType,
          // 'x-auth-token': x_auth_token
        },
        url: extURL,
        json: reqData,
        method: 'POST'
      };

      request( options, function (error, response, body) {
        logger.debug('error:', error); // Print the error if one occurred
        logger.debug('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        logger.debug('body:', body); // Print the HTML for the Google homepage.
        // logger.debug('res ::: %j');
        if (error != null || (response.statusCode != 200 && response.statusCode != 201)) {
          logger.debug('error ::: %j', error);
          result.success = 'false';
          result.error.code = response && response.statusCode;
          if (response && !response.message) result.error.message = body.error.message;
          else if (error) result.error.message = error.Error;
          else result.error.message = response.message;
          logger.debug('result ::: %j', result);
          if (error != null) return cb(error);
          // else { logger.debug('body.message ::: %j', body.message); return cb(body.message); }
          else { logger.debug('body ::: %j', body); return cb(null, result); }
        } else { 
          result.success = 'true'; 

          logger.debug('result ::: %j', result);
          return cb(null, result);
        }
      });
    });
  } 
  // current default weedsoft EXTAPI call
  else {
    let form = {
      gk_key: opts.gk_key,
      gk_secret: opts.gk_secret,
      mgId: opts.mgId,
      userId: opts.userId,
      appId: opts.appId,
      title: opts.title,
      hostId: opts.hostId,
      rwdType: opts.rwdType,
      rwdValue: opts.rwdValue,
      couponLinkUrl: opts.couponLinkUrl,
    };

    let formData = querystring.stringify(form);
    let contentLength = formData.length;

    logger.debug('formData ::: %j, contentLength ::: %j', formData, contentLength);

    request({
      headers: {
        'Content-Length': contentLength,
        'Content-Type': 'application/x-www-form-urlencoded',
        // 'x-auth-token': x_auth_token
      },
      uri: extURL,
      body: formData,
      // form: formData,
      method: 'POST'
    }, function (error, response, body) {
      logger.debug('error:', error); // Print the error if one occurred
      logger.debug('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      logger.debug('body:', body); // Print the HTML for the Google homepage.
      // logger.debug('res ::: %j');
      if (error != null || response.statusCode != 200) {
        logger.debug('error > ', error);
        result.success = 'false';
        result.error.code = response && response.statusCode;
        result.error.message = response.message;
        logger.debug('result > %j', result);
        if (error != null) return cb(error);
        // else { logger.debug('body.message ::: %j', body.message); return cb(body.message); }
        else { logger.debug('body ::: %j', body); return cb(null, result); }
      } else { result.success = 'true'; logger.debug('result ::: %j', result); return cb(null, result); }
    });
  }
  // tmpvalue(appId, x_auth_token) for test ... 2018.08.08
  // let appId = 'app_QwcCtWbI00000';
  // let x_auth_token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhcHBJZCI6ImFwcF9Rd2NDdFdiSTAwMDAwIiwidXNlcklkIjoiZ2FtZWtpa2kwMDAxIiwiZXhwIjoxNTMzODAzMzU5NjM5LCJyZWdEYXRlIjoiMjAxOC0wOC0wOCAxNzoyOToxOS42MzkifQ.xx8_oo59o_yD9KHq3qQmLeSl8zmIa2l5-8bqBq2I-b0';
}

function getCafe24Token(appId, cb1) {
  // 01. check current access_token expire date
  // 02. if access_token expire date exceed current date
  //     check refresh_token and get access_token using refresh_token
  //     save new access_token and refresh_token

  let sequelize = createConnection();

  const AppPlugIn = sequelize.import('../models/app_plugin');
  AppPlugIn.findOne({ where: { appId: appId, actYN: 'Y' }, order: [['regiYHS','DESC']] })
  .then(appPlugin => {
    logger.debug('appPlugin > %j', appPlugin);
    if (appPlugin == null) { sequelize.close(); return cb1('Invalid appId.'); }

    const AppPluginToken = sequelize.import('../models/app_plugin_token');
    AppPluginToken.findOne({ where: { appId: appId }, order: [['regiYHS','DESC']] })
    .then(appPluginToken => {
      logger.debug('appPluginToken > %j', appPluginToken);
      if (appPluginToken == null) { sequelize.close(); return cb1('Invalid appId.'); }
      // correct code ::: else if (new Date(appPluginToken.dataValues.expireYHS) > new Date()) {
      else if (new Date(appPluginToken.dataValues.expireYHS) > new Date()) {
        let rtnToken = appPluginToken.dataValues.access_token;
        sequelize.close();
        return cb1(null, rtnToken);
      } else {
        let querystring = require('querystring');
        let request = require('request');
        let tmpAuthKey = appPlugin.dataValues.pluginId + ':' + appPlugin.dataValues.pluginSecret;
        logger.debug('tmpAuthKey > %j', tmpAuthKey);
        let extURL = 'https://' + tmpAuthKey + '@' + appPlugin.dataValues.pluginName + '.cafe24api.com/api/v2/oauth/token';
        logger.debug('extURL > %j', extURL);
        // let base64AuthKey = new Buffer(tmpAuthKey, 'ascii').toString('base64');
        // logger.debug('base64AuthKey > %j', base64AuthKey);

        let form = {
            grant_type: 'refresh_token',
            refresh_token: appPluginToken.dataValues.refresh_token,
        };
        let formData = querystring.stringify(form);
        let contentLength = formData.length;
        let contentType = 'application/x-www-form-urlencoded';
        let options = {
          headers: {
            // 'Authorization': 'Basic ' + base64AuthKey,
            'Content-Type': contentType,
          },
          url: extURL,
          form: formData,
          method: 'POST',
        };
        logger.debug('formData > %j, contentLength > %j, contentType > %j, options > %j', formData, contentLength, contentType, options);

        request(options, function (error, response, body) {
          if(error) { logger.error(error); sequelize.close(); return cb1(error); }
          else {
            parsedResponse(body, function(err, rtnBody) {
              if (err) { logger.error(err); sequelize.close(); return cb1(err); }
              else {
                if (error != null || (response.statusCode != 200 && response.statusCode != 201)) {
                  logger.debug('error > %j', error);
                  // result.success = 'false';
                  // result.error.code = response && response.statusCode;
                  // if (!response.message) result.error.message = rtnBody.error;
                  // else result.error.message = response.message;
                  // logger.debug('result > %j', result);
            
                  if (error != null) { sequelize.close(); return cb1(error); }
                  else { logger.debug('body > %j', rtnBody); sequelize.close(); return cb1(rtnBody.error); }
                } else { 
                  let moment = require('moment');
                  let tExpDate = moment(rtnBody.expires_at), tRegDate = moment(rtnBody.issued_at), tRefExpDate= moment(rtnBody.refresh_token_expires_at);
                  let newTokenData = {
                    appId: appId,
                    appPluginSerno: appPlugin.dataValues.serno,
                    access_token: rtnBody.access_token,
                    expireYHS: tExpDate,
                    regiYHS: tRegDate,
                    refresh_token: rtnBody.refresh_token,
                    refreshExpireYHS: tRefExpDate,
                  }
                  logger.debug('newTokenData > %j', newTokenData);
            
                  AppPluginToken.create(newTokenData)
                  .then(newAppPluginToken => { cb1(null, rtnBody.access_token); sequelize.close(); return; })
                  .catch(err => { logger.error('newAppPluginToken.err > ', err); cb1(err); sequelize.close(); return; });
                }
              }
            })
          }
        });
      }
    })
    .catch(err => { logger.error('AppPluginToken.err > ', err); cb1(err); sequelize.close(); return; })
  })
  .catch(err => { logger.error('appPlugin.err > ', err); cb1(err); sequelize.close(); return; });

}

function parsedResponse(body, cb2) {
  var parsedBody = {};
  var tmpText = '';
  var isKey = false;
  var isValue = false;
  var tmpKey = '';
  var tmpValue = '';
  var qutCnt = 0;
  // console.log('-----');
  for (let i=0; i<body.length; i++) {
    // logger.debug('isStarted:%j, isKey:%j, isValue:%j, tmpKey:%j, tmpValue:%j', isStarted, isKey, isValue, tmpKey, tmpValue);
    tmpText = body.charAt(i);
    // console.log(tmpText);
    if (tmpText == '{') { continue; }
    if (!isKey && !isValue && tmpText == '\"' && qutCnt == 0) { qutCnt++; isKey = true; continue; }
    if ( isKey && !isValue && tmpText != '\"' && tmpText != ':' && tmpText != ',') { tmpKey += tmpText; continue; }
    if ( isKey && !isValue && tmpText == '\"' && qutCnt != 0) { qutCnt++; isKey = false; continue; }
    if (!isKey && !isValue && tmpText == ':') { continue; }
    if (!isKey && !isValue && tmpText == '\"' && qutCnt == 2) { qutCnt++; isValue = true; continue; }
    if (!isKey &&  isValue && tmpText != '\"' && tmpText != ',') { tmpValue += tmpText; continue; }
    if (!isKey &&  isValue && tmpText == '\"' && qutCnt != 2) { qutCnt = 0; isValue = false; continue; }
    if (!isKey && !isValue && tmpText == ',') { isKey = false; isValue = false; parsedBody[tmpKey] = tmpValue; tmpKey = ''; tmpValue = ''; continue; }
    if (tmpText == '}') { parsedBody[tmpKey] = tmpValue; tmpKey = ''; tmpValue = ''; continue; }
  }
  // console.log('-----');
  logger.debug('parsedResponse.parsedBody:', parsedBody);
  // logger.debug('text.error:', parsedBody.error);
  cb2(null, parsedBody);
}

module.exports = utils;