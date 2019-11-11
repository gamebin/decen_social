/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('appchargetype_log', {
    LogSerno: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    appId: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    chargeType: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    mau: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'appchargetype_log'
  });
};
