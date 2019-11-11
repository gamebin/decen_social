/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('achievement_sub', {
    achiSubSerno: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    actId: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    count: {
      type: DataTypes.INTEGER(3).UNSIGNED,
      allowNull: false,
      defaultValue: '1'
    },
    achiId: {
      type: DataTypes.STRING(20),
      allowNull: true
    }
  }, {
    tableName: 'achievement_sub'
  });
};
