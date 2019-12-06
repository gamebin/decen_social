const httpStatus = require("http-status");
const APIError = require("../helpers/APIError");
const Board = require("./board.model");

/**
 * Load board and append to req.
 */
function load(req, res, next, id) {
  console.debug("board.controller.load.id:", id);
  Board.getBoardInfoBySerno(id)
    .then(board => {
      req.board = board; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get board
 * @returns {Board}
 */
function get(req, res) {
  return res.json(req.board);
}

/**
 * Create new board
 * @property {string} req.body.boardtext - The boardtext of board.
 * @property {string} req.body.userid - The userid of board.
 * @property {string} req.body.title - The title of board.
 * @property {string} req.body.sendto - The sendto of board.
 * @property {string} req.body.imageurl - The imageurl of board.
 * @returns {Product}
 */
function create(req, res, next) {
  let userIp = getUserIP(req);
  let boardData = {
    boardtext : req.body.boardtext,
    userid    : req.body.userid,
    title     : req.body.title,
    sendto    : req.body.sendto,
    imageurl  : req.body.imageurl,
    regYHS    : new Date(),
    userIp    : userIp
  };

  Board.createBoard(boardData)
    .then(savedBoard => {
      let rtnValue = {
        success : true,
        message : "",
        result  : savedBoard
      };
      res.json(rtnValue);
    })
    .catch(e => next(e));
}

/**
 * Update existing board
 * @property {string} req.body.boardtext - The boardtext of board.
 * @property {string} req.body.userid - The userid of board.
 * @property {string} req.body.title - The title of board.
 * @property {string} req.body.sendto - The sendto of board.
 * @property {string} req.body.imageurl - The imageurl of board.
 * @returns {Board}
 */
function update(req, res, next) {
  const board = req.board;
  let boardData = {
    boardSerno : board.boardSerno,
    boardtext  : req.body.boardtext || board.boardtext,
    userid     : req.body.userid || board.userid,
    title      : req.body.title || board.title,
    sendto     : req.body.sendto || board.sendto,
    imageurl   : req.body.imageurl || board.imageurl
  };

  Board.updateBoard(boardData)
    .then(savedBoard => {
      let rtnValue = {
        success : true,
        message : "",
        result  : savedBoard
      };
      res.json(rtnValue);
    })
    .catch(e => {
      console.error(e);
      next(e);
    });
}

/**
 * Delete board.
 * @returns {Board}
 */
function remove(req, res, next) {
  const board = req.board;

  Board.deleteBoard(board)
    .then(deletedBoard => {
      let rtnValue = {
        success : true,
        message : ""
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

module.exports = { load, get, create, update, remove, getUserIP };
