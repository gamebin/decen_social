/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('achievement_user_comp', {
    achiUserSerno: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    achiId: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    compDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    appId: {
      type: DataTypes.STRING(30),
      allowNull: true
    }
  }, {
    tableName: 'achievement_user_comp'
  });
};
