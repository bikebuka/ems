'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Role.belongsToMany(models.User, {
        through: models.UserRole,
        foreignKey: 'roleId',
        otherKey: 'userId',
      });
      //
      Role.belongsToMany(models.Permission, {
        through: models.RoleHasPermission,
        foreignKey: 'roleId',
        otherKey: 'permissionId',
      });
      //
      // Role.hasMany(models.Role, {foreignKey:'createdBy',targetKey:'id'})
    }
  }
  Role.init({
    name: {
      type: DataTypes.STRING,
      allowNull:false,
      unique:true
    },
    description: {
      type: DataTypes.STRING,
      allowNull:false,
      unique:true
    },
    status: {
      type: DataTypes.ENUM("PENDING","ACTIVE","DISABLED")
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key:"id"
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    },
  }, {
    sequelize,
    modelName: 'Role',
  });
  return Role;
};
