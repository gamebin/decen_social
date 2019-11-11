/**
 * updateProfile : update user profile
 * Created by stub on 2016-03-14.
 */

var async       = require('async');
var fstools     = require('fs-tools');
var path        = require('path');
var formidable  = require('formidable');
var utils = require('../../constants/utils');

var updateProfile = {
  execute : function(req, res, callback) {
    return execute(req, res, callback);
  }
};

function execute(req, res, callback) {
  logger.debug('---updateProfile START---');

  var appId     = (req.params && req.params.appId) || (req.body && req.body.appId) || (req.query && req.query.appId) || req.headers['x-appId'];
  var userId    = (req.params && req.params.userId) || (req.body && req.body.userId) || (req.query && req.query.userId) || req.headers['x-userId'];
  var userName  = (req.params && req.params.userName) || (req.body && req.body.userName) || (req.query && req.query.userName) || req.headers['x-userName'];

  logger.debug('appId : %j, userId : %j, userName : %j', appId, userId, userName);

  if (!appId || !userId) {
    var errorMessage = 'appId and token required';
    logger.error(errorMessage);
    return callback(errorMessage);
  }

  var baseImageDir = '/home/gamekiki.com/docs/data/userImg/' + appId + '/';

  var connection = utils.createOldConnection();

  var getUserProfile = 'SELECT userName, userImg FROM user WHERE userId = \'' + userId + '\' AND appId = \'' + appId + '\' ';

  logger.debug('getUserProfile : %j', getUserProfile);

  async.waterfall(
    [
      // 01. 현재 사용자 정보 조회
      function (callback) {
        connection.query(getUserProfile, function (err, results) {
          if (err) { callback(err); return; }
          logger.debug('[updateProfile] 현재 사용자 정보 >>> %j', results);
          callback(null, results);
        });
      },

      // 02. 사용자 정보 업데이트
      function (currentUserInfo, callback) {
        var userImg = null;
        uploadImg(req, function(err, result) {
          if (err === 'NoImage') userImg = null;
          else if (err) { callback(err); return; }
          else userImg = result;

          logger.debug('[updateProfile] userImg : %j', userImg);

          if(!userName)   userName  = currentUserInfo[0].userName;
          if(!userImg)    userImg   = currentUserInfo[0].userImg;

          // MySQL 에서 '\'는 특수문자로 인식함
          // '\' 하나를 넣기위해서는 '\\\\'를 넣어야 함
          if (userImg && userImg.indexOf('\\') > 0) userImg = userImg.replace(/\\/g, '\\\\\\\\');
          logger.debug('[updateProfile] userImge : %j', userImg);

          var updateUserInfo = '';
          updateUserInfo += 'UPDATE user SET ';
          updateUserInfo += ' userName = \'' + userName + '\',';
          updateUserInfo += ' userImg = \'' + userImg + '\'';
          updateUserInfo += ' WHERE userId = \'' + userId + '\' AND appId = \'' + appId + '\' ';

          connection.query(updateUserInfo, function (err, results) {
            if (err) { callback(err); return; }
            else
              callback(null, 'success');
          });
        });
      }
    ],

    function (err, result) {
      if (err) {
        endConnection(err);
        return callback(err);
      } else {
        logger.debug('---updateProfile END---');

        endConnection();
        return callback(null, result);
      }
    }
  ); // end waterfall

  function endConnection(err) {
    if (err) {
      logger.error(err);
      connection.end(
        function (err) {
          if (!err)connection = null;
          else logger.debug(err)
        }
      );

    } else {
      connection.end(function () {
        logger.debug('connection closed');
      });
    }
  }

  function uploadImg(req, callback) {
    var files = null;

    // 안드로이드앱과 같은 모바일 애플리케이션에서의 요청의 인코딩 방식을 확인하기 위해 아래와 같이 검사구문 추가
    if(req.headers['content-type'] === 'application/x-www-form-urlencoded') {
      // 모바일 업로드 요청
      files = req.files;
    } else { //multipart/form-data
      // 일반 웹페이지 업로드 요청
      files = req.files;
    }

    var form = new formidable.IncomingForm();
    form.uploadDir = path.normalize(__dirname+"/../../uploads");   // 업로드 디렉토리
    form.keepExtensions = true;                                 // 파일 확장자 유지
    form.multiples = true;                                      // multiple upload
    form.parse(req,function(err, fields, files){
      logger.debug('files : %j', files);
      logger.debug('files.userImg : %j', files.userImg);

      if (!files || !files.userImg) callback('NoImage');

      // 이 미들웨어는 멀티파트 요청을 파싱하기 위해 form.parse를 사용하는데
      // form.parse의 콜백함수의 매개변수(fields, files)로 폼의 필드 정보들과 파일 정보들이 전달된다.

      // 여러개의 파일을 업로드하는 경우
      else if(files.userImg instanceof Array){
        // async.each를 사용해 files.pict배열 객체의 각각의 파일을 /images 디렉토리로 옮긴다.
        async.each(files.userImg, function(file,cb){
          // 파일명만 추출후 업로드되는 파일명으로 선택하여 이미지가 저장될 경로를 더해준다.
          var destPath = path.normalize(baseImageDir+path.basename(file.path));
          // 해당 파일명을 서버로 전송처
          fstools.move(file.path, destPath, function(err){
            if(err) cb(err);
            else cb();
          })
        }, function(err){
          // 최종 처리 콜백 함
          if(err){ callback(err); }   // 에러가 아니면 성공여부 전달
          else{
            callback(null, destPath + files.userImg.name);
          }
        });
      }
      // 파일을 선택하지 않았을때
      else if(!files.userImg.name){
        // 파일 선택하지 않았을 경우 업로드 과정에서 생긴 크기가 0인 파일을 삭제한다.
        fstools.remove(files.pict.path, function(err){
          if(err){ callback(err); }
          else{
            callback('NoImage');
          }
        })
      }
      // 파일을 하나만 선택했을때
      else{
        if (!files.userImg) callback('NoImage');
        else {
          // 업로드된 파일을(files.pict) /images디렉토리로 옮긴다.
          // 업로드 되는 파일명을 추출해서 이미지가 저장될 경로를 더해준다.
          //var destPath = path.normalize(baseImageDir+path.basename(files.userImg.path));
          var destFileName = Date.now() + '_' + files.userImg.name;
          var destPath     = path.normalize(baseImageDir + destFileName);
          logger.debug('[updateProfile] files.userImg.path : %j, destPath : %j', files.userImg.path, destPath);
          // 임시 폴더에 저장된 이미지 파일을 이미지 경로로 이동시킨다.
          fstools.move(files.userImg.path, destPath, function (err) {
            if (err) {
              callback(err);
            }   // 에러가 아니면 성공여부 전달
            else {
              callback(null, '../data/userImg/' + appId + '/' + destFileName);
            }
          })
        }
      }
    });

    form.on('progress', function(receivedBytes, expectedBytes){
      logger.debug('[updateProfile] ' + ((receivedBytes/expectedBytes)*100).toFixed(1)+'% received');
    });
  }
}

module.exports = updateProfile;