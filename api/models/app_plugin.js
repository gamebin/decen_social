/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('app_plugin', {
    serno: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    appId: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    pluginName: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    pluginType: {
      type: DataTypes.CHAR(3),
      allowNull: true
    },
    pluginId: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    pluginSecret: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    pluginAuth: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    actYN: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    regiYHS: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'app_plugin'
  });
};
