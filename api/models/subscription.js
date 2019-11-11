/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('subscription', {
    sbcrSerno: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    merchant_uid: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    appId: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    amount: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    substatus: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    payDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    card_number: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    developerId: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    imp_uid: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    subscYYMM: {
      type: DataTypes.CHAR(6),
      allowNull: true
    },
    inchargeType: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    Mau: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    gifticonCnt: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    gifticonAmount: {
      type: DataTypes.INTEGER(5).UNSIGNED,
      allowNull: true,
      defaultValue: '0'
    },
    errmsg: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    delFlag: {
      type: DataTypes.CHAR(1),
      allowNull: true,
      defaultValue: 'N'
    },
    delDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    delUserIP: {
      type: DataTypes.STRING(15),
      allowNull: true
    }
  }, {
    tableName: 'subscription'
  });
};
