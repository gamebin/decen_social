/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('blog_sub', {
    subSerno: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    Title: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Content: {
      type: DataTypes.STRING(2000),
      allowNull: true
    },
    Img: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    serno: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    delFlag: {
      type: DataTypes.CHAR(1),
      allowNull: true,
      defaultValue: 'N'
    },
    imgDelFlag: {
      type: DataTypes.CHAR(1),
      allowNull: true,
      defaultValue: 'N'
    }
  }, {
    tableName: 'blog_sub'
  });
};
