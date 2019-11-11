/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('message', {
    msgSerno: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    receiverId: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    sendRecvDstcd: {
      type: DataTypes.CHAR(2),
      allowNull: true
    },
    contents: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    readStusDstcd: {
      type: DataTypes.CHAR(2),
      allowNull: true
    },
    regiYHS: {
      type: DataTypes.DATE,
      allowNull: true
    },
    appId: {
      type: DataTypes.STRING(30),
      allowNull: true
    }
  }, {
    tableName: 'message'
  });
};
