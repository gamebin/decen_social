/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('board', {
    num: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0',
      primaryKey: true
    },
    kind: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    userId: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    userName: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    regiYHS: {
      type: DataTypes.DATE,
      allowNull: true
    },
    cnt: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    pgroup: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    stair: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    step_in: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    parent: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    group_seq: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    fileName1: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    fileSize1: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    fileWidth1: {
      type: DataTypes.INTEGER(6),
      allowNull: true
    },
    UserIP: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    category: {
      type: DataTypes.CHAR(1),
      allowNull: true,
      defaultValue: '1'
    }
  }, {
    tableName: 'board'
  });
};
