const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class User extends Model {
  }

  User.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
      }
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      timestamps: true,
      underscored: true,
    }
  );

  return User;
};
