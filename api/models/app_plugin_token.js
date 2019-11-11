/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('app_plugin_token', {
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
    appPluginSerno: {
      type: DataTypes.STRING(11),
      allowNull: true
    },
    access_token: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    expireYHS: {
      type: DataTypes.DATE,
      allowNull: true
    },
    regiYHS: {
      type: DataTypes.DATE,
      allowNull: true
    },
    refresh_token: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    refreshExpireYHS: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'app_plugin_token'
  });
};
