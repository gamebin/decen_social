/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('v_mg_sum', {
    appId: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    mgId: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    sum(rwdValue): {
      type: "DOUBLE",
      allowNull: true
    }
  }, {
    tableName: 'v_mg_sum'
  });
};
