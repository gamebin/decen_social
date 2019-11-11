/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mg_main_temp', {
    mgMainSerno: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    mgId: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    startYHS: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    endYHS: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    actYN: {
      type: DataTypes.CHAR(1),
      allowNull: false,
      defaultValue: 'N'
    },
    img: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    regYHS: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    appId: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    mgRestrict: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    mgType: {
      type: DataTypes.CHAR(1),
      allowNull: true,
      defaultValue: 'R'
    },
    delFlag: {
      type: DataTypes.CHAR(1),
      allowNull: true,
      defaultValue: 'N'
    },
    delDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    delUserId: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    updateFlag: {
      type: DataTypes.CHAR(1),
      allowNull: true,
      defaultValue: 'N'
    },
    realFlag: {
      type: DataTypes.CHAR(1),
      allowNull: true,
      defaultValue: 'N'
    },
    mgShow: {
      type: DataTypes.CHAR(1),
      allowNull: true,
      defaultValue: '1'
    }
  }, {
    tableName: 'mg_main_temp'
  });
};
