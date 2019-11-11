/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('default_badges', {
    badgesSerno: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    badgesImg: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    badgesName: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    tableName: 'default_badges'
  });
};
