/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('achievement', {
    achiSerno: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    achiId: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    appId: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    achiName: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    achiDesc: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    WriteDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    delFlag: {
      type: DataTypes.CHAR(1),
      allowNull: false,
      defaultValue: 'N'
    },
    point: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    badgeId: {
      type: DataTypes.STRING(30),
      allowNull: true
    }
  }, {
    tableName: 'achievement'
  });
};
