/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('board_file', {
    fileSerno: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    Tb_Contents_num: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    fileName: {
      type: DataTypes.STRING(159),
      allowNull: false
    },
    fileWdith: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    fileHeight: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    fileSize: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    fileKey: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    boardSerno: {
      type: DataTypes.CHAR(11),
      allowNull: true
    }
  }, {
    tableName: 'board_file'
  });
};
