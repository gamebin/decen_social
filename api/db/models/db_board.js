/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('db_board', {
    boardSerno: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    boardtext: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    userid: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    sendto: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    imageurl: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    regYHS: {
      type: DataTypes.DATE,
      allowNull: false
    },
    userIp: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    readcnt: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    },
    reviewcnt: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    }
  }, {
    tableName: 'db_board'
  });
};
