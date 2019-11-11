/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mg_log', {
    mgLogSerno: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    mgId: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    rwdId: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    userId: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    regYHS: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    IP: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    appId: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    rwdTitle: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    rwdValue: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    rwdPrice: {
      type: "DOUBLE",
      allowNull: true
    },
    rwdType: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    contCnt: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    }
  }, {
    tableName: 'mg_log'
  });
};
