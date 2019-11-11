/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('developer', {
    devSerno: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    developerId: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    developerName: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    regiYHS: {
      type: DataTypes.DATE,
      allowNull: true
    },
    userIP: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(70),
      allowNull: true
    },
    passwd: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    authFlag: {
      type: DataTypes.CHAR(1),
      allowNull: true,
      defaultValue: 'N'
    },
    authKey: {
      type: DataTypes.STRING(120),
      allowNull: true
    },
    authDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    mobilePhone: {
      type: DataTypes.STRING(30),
      allowNull: true
    }
  }, {
    tableName: 'developer'
  });
};
