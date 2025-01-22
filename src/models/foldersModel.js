// models/Folder.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Folder extends Model {
    static associate(models) {
      Folder.belongsTo(models.User, { foreignKey: 'user_id' });

      Folder.hasMany(models.Folder, {
        foreignKey: 'parent_folder_id',
        as: 'subfolders',
      });

      Folder.hasMany(models.Note, {
        foreignKey: 'folder_id',
      });
    }
  }

  Folder.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      parent_folder_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      }
    },
    {
      sequelize,
      modelName: 'Folder',
      tableName: 'folders',
      timestamps: true,
      underscored: true,
    }
  );

  return Folder;
};
