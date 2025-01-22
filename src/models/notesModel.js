// models/Note.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Note extends Model {
    static associate(models) {
      Note.belongsTo(models.User, { foreignKey: 'user_id' });

      Note.belongsTo(models.Folder, { foreignKey: 'folder_id' });
    }
  }

  Note.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      user_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      folder_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Note',
      tableName: 'notes',
      timestamps: true,
      underscored: true,
    }
  );

  return Note;
};
