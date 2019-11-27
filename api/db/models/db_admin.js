/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('db_admin', {
    adminSerno: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    adminId: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    passwd: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    domain: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    intro: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    adminName: {
      type: DataTypes.STRING(30),
      allowNull: true
    }
  }, {
    tableName: 'db_admin'
  });
};
