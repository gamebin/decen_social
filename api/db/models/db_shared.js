/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('db_shared', {
    sharedSerno: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    boardSerno: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    userId: {
      type: DataTypes.STRING(20),
      allowNull: true
    }
  }, {
    tableName: 'db_shared'
  });
};
