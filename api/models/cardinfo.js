/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cardinfo', {
    cardSerno: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    UserId: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    appId: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    expriy: {
      type: DataTypes.STRING(7),
      allowNull: true
    },
    selectedFlag: {
      type: DataTypes.CHAR(1),
      allowNull: false
    },
    accessToken: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    card_name: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    regYHS: {
      type: DataTypes.CHAR(14),
      allowNull: false
    },
    customer_uid: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    UserIP: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    card_numb: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    tableName: 'cardinfo'
  });
};
