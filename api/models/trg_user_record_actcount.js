/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('trg_user_record_actcount', {
    serno: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    appId: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    actId: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    joincnt: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    },
    regiYHS: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    tableName: 'trg_user_record_actcount'
  });
};
