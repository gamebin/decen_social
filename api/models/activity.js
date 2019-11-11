/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('activity', {
    actSerno: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    actId: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    actName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    actDeviceOS: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    regiYHS: {
      type: DataTypes.DATE,
      allowNull: true
    },
    actDesc: {
      type: DataTypes.STRING(2000),
      allowNull: true
    },
    userIP: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    appId: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    developerId: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    referAPI: {
      type: "VARBINARY(150)",
      allowNull: true
    }
  }, {
    tableName: 'activity'
  });
};
