/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_record', {
    recordSerno: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    appId: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    actId: {
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
    userId: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    rewSerno: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    newsfeed: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    deviceType: {
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
    targetId: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    deleteYN: {
      type: DataTypes.CHAR(1),
      allowNull: true,
      defaultValue: 'N'
    }
  }, {
    tableName: 'user_record'
  });
};
