/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mg_sub_temp', {
    mgSubSerno: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    rwdId: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    rwdTitle: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    mgId: {
      type: DataTypes.STRING(20),
      allowNull: true
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
    regYHS: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    giftSerno: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    }
  }, {
    tableName: 'mg_sub_temp'
  });
};
