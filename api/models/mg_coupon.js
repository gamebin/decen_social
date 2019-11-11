/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mg_coupon', {
    couSerno: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    couponNumb: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    appId: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    UserId: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    tableName: 'mg_coupon'
  });
};
