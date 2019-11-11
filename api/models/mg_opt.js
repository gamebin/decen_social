/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mg_opt', {
    optSerno: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    mgId: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    appId: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    context: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    regYHS: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'mg_opt'
  });
};
