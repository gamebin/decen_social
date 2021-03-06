/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('db_liked', {
    likedSerno : {
      type          : DataTypes.INTEGER(11),
      allowNull     : false,
      primaryKey    : true,
      autoIncrement : true
    },
    boardSerno : {
      type      : DataTypes.INTEGER(11),
      allowNull : true
    },
    userId : {
      type      : DataTypes.STRING(20),
      allowNull : true
    },
    likeFlag : {
      type         : DataTypes.CHAR(1),
      allowNull    : true,
      defaultValue : '1'
    }
  }, { tableName: 'db_liked' });
};
