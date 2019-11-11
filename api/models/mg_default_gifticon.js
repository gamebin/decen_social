/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mg_default_gifticon', {
    giftSerno: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    giftText: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    giftPrice: {
      type: "DOUBLE",
      allowNull: false
    },
    useFlag: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    imgUrl: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    tableName: 'mg_default_gifticon'
  });
};
