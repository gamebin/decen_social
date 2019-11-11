/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mg_main_actlog', {
    mgLogSerno: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    mgId: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    appId: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    actYN: {
      type: DataTypes.CHAR(1),
      allowNull: false
    },
    regYHS: {
      type: DataTypes.DATE,
      allowNull: false
    },
    UserID: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    UserIP: {
      type: DataTypes.STRING(15),
      allowNull: false
    }
  }, {
    tableName: 'mg_main_actlog'
  });
};
