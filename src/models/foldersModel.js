const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Folder extends Model {
    static associate(models) {
      Folder.belongsTo(models.User, { foreignKey: 'userId' });

      Folder.hasMany(models.Folder, {
        foreignKey: 'parentFolderId',
        as: 'subfolders',
      });

      Folder.hasMany(models.Note, {
        foreignKey: 'folderId',
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
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'user_id',
      },
      parentFolderId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'parent_folder_id',
      },
      deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: 'updated_at',
      },
    },
    {
      sequelize,
      modelName: 'Folder',
      tableName: 'folders',
      timestamps: true,
      underscored: false,
    }
  );

  return Folder;
};
