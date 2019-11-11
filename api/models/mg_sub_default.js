/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mg_sub_default', {
    mgSubSerno: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    rwdTitle: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    rwdType: {
      type: DataTypes.CHAR(1),
      allowNull: false
    },
    rwdValue: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    rwdProb: {
      type: "DOUBLE",
      allowNull: false
    },
    rwdRestrict: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    rwdPrice: {
      type: "DOUBLE",
      allowNull: true
    },
    appId: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    giftSerno: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    chargeType: {
      type: DataTypes.CHAR(1),
      allowNull: true,
      defaultValue: '0'
    }
  }, {
    tableName: 'mg_sub_default'
  });
};
