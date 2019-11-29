/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('db_user', {
    userserno : {
      type          : DataTypes.INTEGER(10).UNSIGNED,
      allowNull     : false,
      primaryKey    : true,
      autoIncrement : true
    },
    userid : {
      type      : DataTypes.STRING(20),
      allowNull : false
    },
    username : {
      type      : DataTypes.STRING(40),
      allowNull : false
    },
    userpasswd : {
      type      : DataTypes.STRING(64),
      allowNull : true
    },
    summary : {
      type      : DataTypes.STRING(1000),
      allowNull : true
    },
    Image : {
      type      : DataTypes.STRING(100),
      allowNull : true
    },
    regYHS : {
      type      : DataTypes.DATE,
      allowNull : true
    },
    email : {
      type         : DataTypes.STRING(70),
      allowNull    : false,
      defaultValue : '0'
    },
    following : {
      type         : DataTypes.INTEGER(5).UNSIGNED,
      allowNull    : false,
      defaultValue : '0'
    },
    followers : {
      type         : DataTypes.INTEGER(5).UNSIGNED,
      allowNull    : false,
      defaultValue : '0'
    },
    linked : {
      type         : DataTypes.INTEGER(5).UNSIGNED,
      allowNull    : false,
      defaultValue : '0'
    },
    shared : {
      type         : DataTypes.INTEGER(5).UNSIGNED,
      allowNull    : false,
      defaultValue : '0'
    },
    userIp : {
      type      : DataTypes.STRING(15),
      allowNull : false
    },
    delFlag : {
      type         : DataTypes.CHAR(1),
      allowNull    : true,
      defaultValue : 'N'
    },
    delDate : {
      type      : DataTypes.DATE,
      allowNull : true
    },
    delUserIP : {
      type      : DataTypes.STRING(15),
      allowNull : true
    },
    gubun : {
      type         : DataTypes.CHAR(1),
      allowNull    : true,
      defaultValue : '1'
    }
  }, { tableName: 'db_user' });
};
