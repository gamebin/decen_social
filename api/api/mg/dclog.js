/**
 * dclog : user daily log
 * Created by stub on 2018-06-29
 */

// API 입력값
// - mgId
// - userId
// - startD : 조회 시작일
// - endD : 조회 종료일(기본값:조회당일)

// API 출력값
// - result
// - error

// API validation check
//

// 01. 조회 시작일 ~ 조회 종료일 기간동안 일별 누적 마일리지 조회

"use strict";

var utils = require('../../constants/utils');
var moment = require('moment');

var dclog = {
    execute: function(req, res, callback) {
        return execute(req, res, callback);
    }
};

function execute(req, res, callback) {
    logger.debug('---dclog START---');

    var appId = (req.params && req.params.appId) || (req.body && req.body.appId) || (req.query && req.query.appId) || req.headers['x-appId'];
    var mgId = (req.params && req.params.mgId) || (req.body && req.body.mgId) || (req.query && req.query.mgId) || req.headers['x-mgId'];
    var userId = (req.params && req.params.userId) || (req.body && req.body.userId) || (req.query && req.query.userId) || req.headers['x-userId'];
    var startD = (req.params && req.params.startD) || (req.body && req.body.startD) || (req.query && req.query.startD) || req.headers['x-startD'];
    var endD = (req.params && req.params.endD) || (req.body && req.body.endD) || (req.query && req.query.endD) || req.headers['x-endD'];

    if (!appId || !mgId || !userId || !startD) {
        var errorMessage = 'appId, userId, mgId, startD required';
        logger.error(errorMessage);
        return callback(errorMessage);
    }

    if (!endD) endD = moment().format('YYYY-MM-DD');

    logger.debug('appId ::: %j, mgId ::: %j, userId ::: %j, startD ::: %j, endD ::: %j', appId, mgId, userId, startD, endD);

    const sequelize = utils.createConnection();

    let getDcLogs =  'SELECT ';
        getDcLogs += '   d_date.Date, CASE WHEN date(mu.date) IS NULL THEN 0 ELSE mu.s_mileage END AS mileage, ';
        getDcLogs += '   CASE WHEN mu.rwdType IS NULL THEN \'P\' ELSE mu.rwdType END AS rwdType, ';
        getDcLogs += '   CASE WHEN mu.unitText IS NULL OR mu.unitText = \'\' THEN \'M\' ELSE mu.unitText END AS unitText ';
        getDcLogs += 'FROM ';
        getDcLogs += '   ( ';
        getDcLogs += '         SELECT a.Date ';
        getDcLogs += '         FROM ( ';
        getDcLogs += '             SELECT curdate() - INTERVAL (a.a + (10 * b.a) + (100 * c.a)) DAY AS Date ';
        getDcLogs += '             FROM (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS a ';
        getDcLogs += '             CROSS JOIN (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS b ';
        getDcLogs += '             CROSS JOIN (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS c ';
        getDcLogs += '         ) a ';
        getDcLogs += '         WHERE a.Date BETWEEN \'' + startD + '\' AND \'' + endD + '\' ';
        getDcLogs += '    ) d_date ';
        getDcLogs += '    LEFT OUTER JOIN ';
        getDcLogs += '    ( ';
        getDcLogs += '        SELECT MAX(mgLogSerno) AS mgLogSerno, date(ml.regYHS) AS DATE, ml.mgId, ml.userId, sum(ml.rwdValue) AS s_mileage, ml.rwdType AS rwdType, ms.unitText AS unitText ';
        getDcLogs += '        FROM mg_log AS ml INNER JOIN mg_sub AS ms ON ml.appId = ms.appId AND ml.mgId = ms.mgId AND ml.rwdId = ms.rwdId ';
        getDcLogs += '        INNER JOIN ( ';
        getDcLogs += '          SELECT max(mgLogSerno) AS max_logSerno ';
        getDcLogs += '          FROM mg_log ';
        getDcLogs += '          WHERE mgId=\'' + mgId + '\' AND userId=\'' + userId + '\' AND date(regYHS) BETWEEN \'' + startD + '\' AND \'' + endD + '\' ';
        getDcLogs += '          GROUP BY date(regYHS) ';
        getDcLogs += '        ) t ON ml.mgLogSerno = t.max_logSerno ';
        getDcLogs += '        GROUP BY date(ml.regYHS), ml.userId ';
        getDcLogs += '    ) mu ';
        getDcLogs += '    ON d_date.Date = mu.date ';
        getDcLogs += 'ORDER BY d_date.Date ASC ';

    // logger.debug('getDcLogs ::: %j', getDcLogs);

    sequelize.query(getDcLogs)
    .spread(function(stInfos) {
        // logger.debug('stInfos ::: %j', stInfos);
        callback(null, stInfos);
        sequelize.close();
        return;
    }, function(err) {
        logger.error('stInfos.err ::: %j', err);
        callback(err);
        sequelize.close();
        return;
    });

}

module.exports = dclog;