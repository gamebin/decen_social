/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('appbadges', {
    badgeSerno: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    badgeId: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    badgeName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    badgeImg: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    badgeDate: {
      type: DataTypes.DATE,
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
    badgeDesc: {
      type: DataTypes.STRING(5000),
      allowNull: true
    }
  }, {
    tableName: 'appbadges'
  });
};
