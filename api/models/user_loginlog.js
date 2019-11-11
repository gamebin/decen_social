/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_loginlog', {
    loginToken: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ''
    },
    userId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: ''
    },
    loginlogSerno: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    logindate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    expiredYN: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    loginType: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    appId: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    UserIp: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    accCountry: {
      type: DataTypes.CHAR(2),
      allowNull: true,
      defaultValue: 'NA'
    },
    accCity: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: 'NA'
    }
  }, {
    tableName: 'user_loginlog'
  });
};
