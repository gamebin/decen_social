/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mileage_uselog', {
    muLogSerno: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    appId: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    userId: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    regiYHS: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    mileage: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    chk: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    comments: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    rwdId: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    sign1: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    modiYHS: {
      type: DataTypes.DATE,
      allowNull: true
    },
    balanMileage: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    mgId: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    rwdValue: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    rwdTitle: {
      type: DataTypes.STRING(45),
      allowNull: true
    }
  }, {
    tableName: 'mileage_uselog'
  });
};
