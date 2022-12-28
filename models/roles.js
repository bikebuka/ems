'use strict';
const {
  Model
} = require('sequelize');
const slugify = require("slugify");
module.exports = (sequelize, DataTypes) => {
  class Roles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Roles.belongsToMany(models.Users, {
        through: models.UserRoles,
        foreignKey: 'role_id',
        otherKey: 'user_id',
      });

      Roles.belongsToMany(models.Permission, {
        through: models.RolePermission,
        foreignKey: 'role_id',
        otherKey: 'permission_id',
      });

      Roles.hasMany(models.Roles, {foreignKey:'createdBy'})
    }
  }
  Roles.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    slug: {
      type: DataTypes.STRING,
      unique: true
    },
    description: DataTypes.STRING(1000),
    IsActive: DataTypes.BOOLEAN,
    IsDeleted: DataTypes.BOOLEAN,
    createdBy: DataTypes.UUID,
  }, {
    sequelize,
    modelName: 'Roles',
    indexes: [
      {fields: ['slug']}
    ],
    hooks: {
      beforeValidate(role, options) {
        role.slug = slugify(role.name,{lower: true})
      }
    }
  });
  return Roles;
};
