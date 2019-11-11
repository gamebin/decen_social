/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('application', {
    appSerno: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    appId: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    appName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    appDeviceOS: {
      type: DataTypes.CHAR(3),
      allowNull: true
    },
    regiYHS: {
      type: DataTypes.DATE,
      allowNull: true
    },
    developerId: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    userIP: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    appDesc: {
      type: DataTypes.STRING(4000),
      allowNull: true
    },
    appSecret: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    appCate: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    siteUrl: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    bgColor: {
      type: DataTypes.STRING(7),
      allowNull: true,
      defaultValue: '#3fc556'
    },
    appChargeType: {
      type: DataTypes.CHAR(1),
      allowNull: true,
      defaultValue: '0'
    },
    productRecomYN: {
      type: DataTypes.CHAR(1),
      allowNull: true,
      defaultValue: 'Y'
    },
    limitedAmt: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    },
    dashboardFlag: {
      type: DataTypes.CHAR(1),
      allowNull: true,
      defaultValue: 'Y'
    },
    dashboardDetailFlag: {
      type: DataTypes.CHAR(3),
      allowNull: true,
      defaultValue: '111'
    },
    apiUrl: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    gk_key: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    gk_secret: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    hostId: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    apiYN: {
      type: DataTypes.CHAR(1),
      allowNull: true,
      defaultValue: 'N'
    },
    appChargePrice: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    pcPosition: {
      type: DataTypes.CHAR(1),
      allowNull: true,
      defaultValue: 'R'
    },
    mobilePosition: {
      type: DataTypes.CHAR(1),
      allowNull: true,
      defaultValue: 'R'
    },
    pcleft: {
      type: DataTypes.INTEGER(6),
      allowNull: true,
      defaultValue: '50'
    },
    pcTop: {
      type: DataTypes.INTEGER(6),
      allowNull: true,
      defaultValue: '50'
    },
    mobileLeft: {
      type: DataTypes.INTEGER(6),
      allowNull: true,
      defaultValue: '50'
    },
    mobileTop: {
      type: DataTypes.INTEGER(6),
      allowNull: true,
      defaultValue: '50'
    },
    seriesFlag: {
      type: DataTypes.CHAR(1),
      allowNull: true,
      defaultValue: '1'
    },
    pluginType: {
      type: DataTypes.CHAR(3),
      allowNull: true,
      defaultValue: 'ETC'
    }
  }, {
    tableName: 'application'
  });
};
