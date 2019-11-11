/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('gd_prod', {
    gdProdSerno: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    appId: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    prodId: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    prodImgUrl: {
      type: DataTypes.STRING(400),
      allowNull: true
    },
    prodUrl: {
      type: DataTypes.STRING(400),
      allowNull: true
    },
    prodQty: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true
    },
    prodName: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    kword: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    regYHS: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updateYHS: {
      type: DataTypes.DATE,
      allowNull: true
    },
    IP: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    listFlag: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    prodPrice: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'gd_prod'
  });
};
