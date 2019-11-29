const SequelizeGen = require('../helpers/SequelizeGen');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

var getUserInfoBySerno = userserno => {
  const sequelize = SequelizeGen.createConnection();
  const User = sequelize.import('../../db/models/db_user');

  return User.findOne({ where: { userserno: userserno }, raw: true })
    .then(userInfo => {
      return userInfo ? Promise.resolve(userInfo) : Promise.reject(new APIError('No such user exists!', httpStatus.NOT_FOUND));
    })
    .catch(err => {
      // console.error(err);
      return Promise.reject(err);
    })
    .finally(() => {
      sequelize.close();
    });
};

var getUserInfoByUserId = userid => {
  const sequelize = SequelizeGen.createConnection();
  const User = sequelize.import('../../db/models/db_user');

  return User.findOne({ where: { userid: userid }, raw: true })
    .then(userInfo => {
      return userInfo ? Promise.resolve(userInfo) : Promise.reject(new APIError('No such user exists!', httpStatus.NOT_FOUND));
    })
    .catch(err => {
      // console.error(err);
      return Promise.reject(err);
    })
    .finally(() => {
      sequelize.close();
    });
};

var createUser = userData => {
  const sequelize = SequelizeGen.createConnection();
  const User = sequelize.import('../../db/models/db_user');

  return User.create(userData)
    .then(user => {
      return user ? Promise.resolve(user) : Promise.reject(new APIError('No such user exists!', httpStatus.NOT_FOUND));
    })
    .catch(err => {
      console.error(err);
      return Promise.reject(err);
    })
    .finally(() => {
      sequelize.close();
    });
};

var updateUser = userData => {
  const sequelize = SequelizeGen.createConnection();
  const User = sequelize.import('../../db/models/db_user');

  // console.debug('updateUser.userData:', userData);
  return User.update(userData, { where: { userserno: userData.userserno } })
    .then(user => {
      return User.findOne({ where: { userserno: userData.userserno } });
      // return user ? Promise.resolve(user) : Promise.reject(new APIError('No such user exists!', httpStatus.NOT_FOUND));
    })
    .catch(err => {
      console.error(err);
      return Promise.reject(err);
    })
    .finally(() => {
      sequelize.close();
    });
};

var deleteUser = userData => {
  const sequelize = SequelizeGen.createConnection();
  const User = sequelize.import('../../db/models/db_user');

  return User.destroy({ where: { userserno: userData.userserno } })
    .then(user => {
      return user ? Promise.resolve(user) : Promise.reject(new APIError('No such user exists!', httpStatus.NOT_FOUND));
    })
    .catch(err => {
      console.error(err);
      return Promise.reject(err);
    })
    .finally(() => {
      sequelize.close();
    });
};

module.exports = { getUserInfoBySerno, getUserInfoByUserId, createUser, updateUser, deleteUser };
