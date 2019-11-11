/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('wg_order', {
    wgSerno: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    appId: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    widgetId: {
      type: DataTypes.CHAR(10),
      allowNull: true
    },
    orderNumb: {
      type: DataTypes.INTEGER(3).UNSIGNED,
      allowNull: true
    },
    totCnt: {
      type: DataTypes.INTEGER(3).UNSIGNED,
      allowNull: true
    },
    contCnt: {
      type: DataTypes.INTEGER(3).UNSIGNED,
      allowNull: true
    },
    refWidgetId: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    mgType: {
      type: DataTypes.CHAR(1),
      allowNull: true,
      defaultValue: 'R'
    }
  }, {
    tableName: 'wg_order'
  });
};
