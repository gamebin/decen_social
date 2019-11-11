/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('connectipinfo', {
    ip: {
      type: DataTypes.STRING(15),
      allowNull: false,
      defaultValue: '',
      primaryKey: true
    },
    country: {
      type: DataTypes.CHAR(2),
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    tableName: 'connectipinfo'
  });
};
