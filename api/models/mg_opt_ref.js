/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mg_opt_ref', {
    refSerno: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    optSerno: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    context: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    filename: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    mgID: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    clickCnt: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    appId: {
      type: DataTypes.STRING(30),
      allowNull: false
    }
  }, {
    tableName: 'mg_opt_ref'
  });
};
