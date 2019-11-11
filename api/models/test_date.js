/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('test_date', {
    date: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    regiYHS: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'test_date'
  });
};
