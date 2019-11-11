/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mg_image', {
    serno: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    mgId: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    appId: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    jsonUseFlag: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    jsonUrl: {
      type: DataTypes.STRING(200),
      allowNull: true
    }
  }, {
    tableName: 'mg_image'
  });
};
