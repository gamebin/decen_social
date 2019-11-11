/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_reward_log', {
    rewLogSerno: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    sign1: {
      type: DataTypes.CHAR(1),
      allowNull: false,
      defaultValue: '+'
    },
    point: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    WriteDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    appId: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    actId: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    comments: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    rewSerno: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    chk: {
      type: DataTypes.CHAR(1),
      allowNull: true
    }
  }, {
    tableName: 'user_reward_log'
  });
};
