/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mg_gifticon', {
    giftSerno: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    giftText: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    giftPrice: {
      type: "DOUBLE",
      allowNull: false
    },
    appId: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    useFlag: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    imgurl: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    tableName: 'mg_gifticon'
  });
};
