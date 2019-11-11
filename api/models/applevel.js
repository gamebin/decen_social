/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('applevel', {
    levelSerno: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    levelId: {
      type: DataTypes.STRING(4),
      allowNull: true
    },
    minPoint: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    maxPoint: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    levelName: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    appId: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    userIP: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    developerId: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    levelImg: {
      type: DataTypes.STRING(150),
      allowNull: true
    }
  }, {
    tableName: 'applevel'
  });
};
