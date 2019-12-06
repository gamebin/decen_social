const httpStatus = require("http-status");
const APIError = require("../helpers/APIError");
const Linking = require("./linking.model");

/**
 * Load friend and append to req.
 */
function load(req, res, next, id) {
  console.debug("friend.controller.load.id:", id);
  Linking.getFriendInfoBySerno(id)
    .then(friend => {
      req.friend = friend; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get friend
 * @returns {Friend}
 */
function get(req, res) {
  return res.json(req.friend);
}

/**
 * Create new friend
 * @property {string} req.body.userid - The userid of friend.
 * @property {string} req.body.friendId - The friendId of friend.
 * @returns {Friend}
 */
function create(req, res, next) {
  let userIp = getUserIP(req);
  let friendData = {
    userid   : req.body.userid,
    friendId : req.body.friendId,
    regYHS   : new Date(),
    userIp   : userIp
  };

  Linking.createFriend(friendData)
    .then(savedFriend => {
      let rtnValue = {
        success : true,
        message : "",
        result  : savedFriend
      };
      res.json(rtnValue);
    })
    .catch(e => next(e));
}

/**
 * Delete friend.
 * @returns {Friend}
 */
function remove(req, res, next) {
  const friend = { userid: req.body.userid, friendId: req.body.friendId };

  Linking.deleteFriend(friend)
    .then(deletedFriend => {
      let rtnValue = {
        success : true,
        message : ""
      };
      res.json(rtnValue);
    })
    .catch(e => next(e));
}

/**
 * Create new liked
 * @property {string} req.body.boardSerno - The boardSerno of liked.
 * @property {string} req.body.userId - The userId of liked.
 * @returns {Linked}
 */
function like(req, res, next) {
  let likedData = {
    boardSerno : req.body.boardSerno,
    userId     : req.body.userId,
    likeDate   : new Date()
  };
  console.debug("likedData:", likedData);

  Linking.createLiked(likedData)
    .then(savedLiked => {
      let rtnValue = {
        success : true,
        message : "",
        result  : savedLiked
      };
      res.json(rtnValue);
    })
    .catch(e => next(e));
}

function getUserIP(req) {
  let ipAddress;

  if (!!req.hasOwnProperty("sessionID")) {
    ipAddress = req.headers["x-forwarded-for"];
  } else {
    if (!ipAddress) {
      let forwardedIpsStr = req.header("x-forwarded-for");

      if (forwardedIpsStr) {
        let forwardedIps = forwardedIpsStr.split(",");
        ipAddress = forwardedIps[0];
      }
      if (!ipAddress) {
        ipAddress = req.connection.remoteAddress;
      }
    }
  }

  let idxColon = ipAddress.lastIndexOf(":");
  let rtnValue = ipAddress.substring(idxColon + 1, ipAddress.length);
  console.debug(rtnValue);
  return rtnValue;
}

module.exports = { load, get, create, remove, like, getUserIP };
