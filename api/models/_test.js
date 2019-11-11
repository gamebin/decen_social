/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('_test', {
    num: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '0',
      primaryKey: true
    },
    id: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    row: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
    date: {
      type: DataTypes.CHAR(10),
      allowNull: true
    }
  }, {
    tableName: '_test'
  });
};
