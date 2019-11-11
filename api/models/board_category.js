/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('board_category', {
    category: {
      type: DataTypes.CHAR(1),
      allowNull: false,
      primaryKey: true
    },
    categoryName: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    orderby: {
      type: DataTypes.INTEGER(3).UNSIGNED,
      allowNull: true
    },
    useFlag: {
      type: DataTypes.CHAR(1),
      allowNull: true,
      defaultValue: 'Y'
    }
  }, {
    tableName: 'board_category'
  });
};
