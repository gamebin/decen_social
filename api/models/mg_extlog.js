/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mg_extlog', {
    mgExtLogSerno: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    appId: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    userId: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    mgId: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    rwdValue: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    mgTitle: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    extUrl: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    extGkKey: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    extGkSecret: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    extHostId: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    extResultYN: {
      type: DataTypes.CHAR(1),
      allowNull: true,
      defaultValue: 'N'
    },
    regYHS: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    rwdType: {
      type: DataTypes.CHAR(2),
      allowNull: false
    },
    couponLinkUrl: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    pluginType: {
      type: DataTypes.CHAR(3),
      allowNull: true,
      defaultValue: 'ETC'
    },
    extLogMsg: {
      type: DataTypes.STRING(300),
      allowNull: true
    }
  }, {
    tableName: 'mg_extlog'
  });
};
