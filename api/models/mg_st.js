/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mg_st', {
    mgStSerno: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    stId: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    mgId: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    rwdId: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    stYHS: {
      type: DataTypes.DATE,
      allowNull: false
    },
    regYHS: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    selectedUserId: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    selectedYHS: {
      type: DataTypes.DATE,
      allowNull: true
    },
    usedPhone: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    usedYHS: {
      type: DataTypes.DATE,
      allowNull: true
    },
    gPin: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    compYHS: {
      type: DataTypes.DATE,
      allowNull: true
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
      allowNull: true,
      defaultValue: 'G'
    }
  }, {
    tableName: 'mg_st'
  });
};
