/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    userSerno: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    userName: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    userPoint: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: true,
      defaultValue: '0'
    },
    appId: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    regiYHS: {
      type: DataTypes.DATE,
      allowNull: true
    },
    possessBadges: {
      type: DataTypes.INTEGER(6).UNSIGNED,
      allowNull: true
    },
    userId: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    userIP: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    UserImg: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    joinRoute: {
      type: DataTypes.CHAR(1),
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
    },
    userMileage: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: true,
      defaultValue: '0'
    }
  }, {
    tableName: 'user'
  });
};
