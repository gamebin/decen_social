/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('blog', {
    serno: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    introTitle: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    introContent: {
      type: DataTypes.STRING(2000),
      allowNull: false
    },
    introImg: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    category: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    regiYHS: {
      type: DataTypes.DATE,
      allowNull: true
    },
    UserIP: {
      type: DataTypes.STRING(15),
      allowNull: true
    }
  }, {
    tableName: 'blog'
  });
};
