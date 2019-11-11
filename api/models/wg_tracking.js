/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('wg_tracking', {
    wtSerno: {
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
    pageEvent: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    eventChk: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    todayNumb: {
      type: DataTypes.INTEGER(3).UNSIGNED,
      allowNull: true
    },
    contNumb: {
      type: DataTypes.INTEGER(3).UNSIGNED,
      allowNull: true
    },
    regiYHS: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    eventTyp: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    eventId: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    IP: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    playcount: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    },
    userAgent: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    mgType: {
      type: DataTypes.CHAR(1),
      allowNull: true
    }
  }, {
    tableName: 'wg_tracking'
  });
};
