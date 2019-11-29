/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('db_review', {
    reviewSerno : {
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
    review : {
      type      : DataTypes.TEXT,
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
  }, { tableName: 'db_review' });
};
