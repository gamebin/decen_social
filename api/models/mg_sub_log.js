/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mg_sub_log', {
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
      type: DataTypes.STRING(50),
      allowNull: true
    },
    giftSerno: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    appId: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    modifyYHS: {
      type: DataTypes.DATE,
      allowNull: true
    },
    UserIP: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    modifyUserID: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    couponUseFlag: {
      type: DataTypes.CHAR(1),
      allowNull: true,
      defaultValue: '0'
    },
    couponLinkUrl: {
      type: DataTypes.STRING(300),
      allowNull: true
    }
  }, {
    tableName: 'mg_sub_log'
  });
};
