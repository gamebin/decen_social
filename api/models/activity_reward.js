/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('activity_reward', {
    rewSerno: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    rewKind: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    rewardValue: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    regiYHS: {
      type: DataTypes.DATE,
      allowNull: true
    },
    actId: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    userIP: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    restricted: {
      type: DataTypes.STRING(3),
      allowNull: true,
      defaultValue: '1'
    }
  }, {
    tableName: 'activity_reward'
  });
};
