/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('leaderboard', {
    boardSerno: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    appId: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    ranking: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    userID: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    userPoint: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    regiYHS: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'leaderboard'
  });
};
