'use strict';
const slugify = require('slugify')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Permission.belongsToMany(models.Roles, {
        through: models.RolePermission,
        foreignKey: 'permission_id',
        otherKey: 'role_id',
      });

      Permission.hasMany(models.Users, {foreignKey:'createdBy'})
    }
  }
  Permission.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    permission_name: DataTypes.STRING,
    permission_slug: {
      type: DataTypes.STRING
    },
    permission_description: DataTypes.STRING(1000),
    IsActive: DataTypes.BOOLEAN,
    IsDeleted: DataTypes.BOOLEAN,
    createdBy: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'Permission',
    indexes: [
      {fields: ['permission_slug']}
    ],
    hooks: {
      beforeValidate(permission, options) {
        permission.permission_slug = slugify(permission.permission_name, {lower: true})
      }
    }
  });
  return Permission;
};
