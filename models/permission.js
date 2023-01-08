'use strict';
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
      Permission.belongsToMany(models.Role, {
        through: models.RoleHasPermission,
        foreignKey: 'permissionId',
        otherKey: 'roleId',
      });

      // Permission.hasMany(models.User, {foreignKey:'createdBy',targetKey:'id'})

    }
  }
  Permission.init({
    name: {
      type: DataTypes.STRING,
      allowNull:false,
      unique:true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull:false,
      unique:true
    },
    status: {
      type: DataTypes.ENUM("PENDING","ACTIVE","DISABLED")
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // references: {
      //   model: "Users",
      //   key:"id"
      // },
      // onDelete: 'cascade',
      // onUpdate: 'cascade'
    },
  }, {
    sequelize,
    modelName: 'Permission',
  });
  return Permission;
};
