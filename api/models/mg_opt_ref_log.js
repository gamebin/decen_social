/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mg_opt_ref_log', {
    optLogSerno: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    optSerno: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    refSerno: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    mgId: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    appId: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    refContext: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    userId: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    regYHS: {
      type: DataTypes.DATE,
      allowNull: true
    },
    filename: {
      type: DataTypes.STRING(200),
      allowNull: true
    }
  }, {
    tableName: 'mg_opt_ref_log'
  });
};
