const SequelizeGen = require("../helpers/SequelizeGen");
const httpStatus = require("http-status");
const APIError = require("../helpers/APIError");

var getBoardInfoBySerno = boardSerno => {
  const sequelize = SequelizeGen.createConnection();
  const Board = sequelize.import("../../db/models/db_board");

  return Board.findOne({ where: { boardSerno: boardSerno }, raw: true })
    .then(boardInfo => {
      return boardInfo
        ? Promise.resolve(boardInfo)
        : Promise.reject(
          new APIError("No such board exists!", httpStatus.NOT_FOUND)
        );
    })
    .catch(err => {
      // console.error(err);
      return Promise.reject(err);
    })
    .finally(() => {
      sequelize.close();
    });
};

var createBoard = boardData => {
  const sequelize = SequelizeGen.createConnection();
  const Board = sequelize.import("../../db/models/db_board");

  return Board.create(boardData)
    .then(board => {
      return Board.findOne({
        where : { userid: boardData.userid, title: boardData.title },
        raw   : true
      });
    })
    .catch(err => {
      console.error(err);
      return Promise.reject(err);
    })
    .finally(() => {
      sequelize.close();
    });
};

var updateBoard = boardData => {
  const sequelize = SequelizeGen.createConnection();
  const Board = sequelize.import("../../db/models/db_board");

  return Board.update(boardData, {
    where : { boardSerno: boardData.boardSerno }
  })
    .then(board => {
      return Board.findOne({ where: { boardSerno: boardData.boardSerno } });
    })
    .catch(err => {
      console.error(err);
      return Promise.reject(err);
    })
    .finally(() => {
      sequelize.close();
    });
};

var deleteBoard = boardData => {
  const sequelize = SequelizeGen.createConnection();
  const Board = sequelize.import("../../db/models/db_board");

  return Board.destroy({ where: { boardSerno: boardData.boardSerno } })
    .then(board => {
      return board
        ? Promise.resolve(board)
        : Promise.reject(
          new APIError("No such board exists!", httpStatus.NOT_FOUND)
        );
    })
    .catch(err => {
      console.error(err);
      return Promise.reject(err);
    })
    .finally(() => {
      sequelize.close();
    });
};

module.exports = {
  getBoardInfoBySerno,
  createBoard,
  updateBoard,
  deleteBoard
};
