/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('friend', {
    friSerno: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    UserId: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    friendUserid: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    friendStusDstcd: {
      type: DataTypes.CHAR(2),
      allowNull: true
    },
    applystartYmd: {
      type: DataTypes.DATE,
      allowNull: true
    },
    appId: {
      type: DataTypes.STRING(30),
      allowNull: true
    }
  }, {
    tableName: 'friend'
  });
};
