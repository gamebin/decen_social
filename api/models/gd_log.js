/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('gd_log', {
    gdLogSerno: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    gdLogId: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    appId: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    userId: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    kword: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    regYHS: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    IP: {
      type: DataTypes.STRING(15),
      allowNull: false
    }
  }, {
    tableName: 'gd_log'
  });
};
