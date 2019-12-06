const SequelizeGen = require("../helpers/SequelizeGen");
const httpStatus = require("http-status");
const APIError = require("../helpers/APIError");

var getFriendInfoBySerno = friendSerno => {
  const sequelize = SequelizeGen.createConnection();
  const Friend = sequelize.import("../../db/models/db_friends");

  return Friend.findOne({ where: { friendSerno: friendSerno }, raw: true })
    .then(friendInfo => {
      return friendInfo
        ? Promise.resolve(friendInfo)
        : Promise.reject(
          new APIError("No such friend exists!", httpStatus.NOT_FOUND)
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

var createFriend = friendData => {
  const sequelize = SequelizeGen.createConnection();
  const Friend = sequelize.import("../../db/models/db_friends");

  return Friend.create(friendData)
    .then(friend => {
      return Friend.findOne({
        where : { userid: friendData.userid, friendId: friendData.friendId },
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

var deleteFriend = friendData => {
  const sequelize = SequelizeGen.createConnection();
  const Friend = sequelize.import("../../db/models/db_friends");

  return Friend.destroy({
    where : { userid: friendData.userid, friendId: friendData.friendId }
  })
    .then(friend => {
      return friend
        ? Promise.resolve(friend)
        : Promise.reject(
          new APIError("No such friend exists!", httpStatus.NOT_FOUND)
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

var createLiked = likedData => {
  const sequelize = SequelizeGen.createConnection();
  const Liked = sequelize.import("../../db/models/db_liked");

  return Liked.create(likedData)
    .then(liked => {
      // console.debug("liked:", liked);
      return Liked.findOne({
        where : { boardSerno: likedData.boardSerno, userId: likedData.userId },
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

module.exports = {
  getFriendInfoBySerno,
  createFriend,
  deleteFriend,
  createLiked
};
