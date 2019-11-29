/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('db_friends', {
    friendSerno : {
      type          : DataTypes.INTEGER(11),
      allowNull     : false,
      primaryKey    : true,
      autoIncrement : true
    },
    userid : {
      type      : DataTypes.STRING(20),
      allowNull : true
    },
    friendId : {
      type      : DataTypes.STRING(20),
      allowNull : true
    },
    regYHS : {
      type      : DataTypes.DATE,
      allowNull : true
    },
    userIp : {
      type      : DataTypes.STRING(15),
      allowNull : true
    }
  }, { tableName: 'db_friends' });
};
