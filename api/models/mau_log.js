/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mau_log', {
    mauSerno: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    appId: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    daymau: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    regYYMMDD: {
      type: DataTypes.STRING(8),
      allowNull: true
    }
  }, {
    tableName: 'mau_log'
  });
};
