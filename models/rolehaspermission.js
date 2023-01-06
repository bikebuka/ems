'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RoleHasPermission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      RoleHasPermission.belongsTo(models.Role, {foreignKey:'roleId'});
      RoleHasPermission.belongsTo(models.Permission, {foreignKey:'permissionId'});
    }
  }
  RoleHasPermission.init({
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references:{
        model: 'Roles',
        key:'id'
      },
      onUpdate:'cascade',
      onDelete:'cascade',
    },
    permissionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references:{
        model: 'Permissions',
        key:'id'
      },
      onUpdate:'cascade',
      onDelete:'cascade',
    },
  }, {
    sequelize,
    modelName: 'RoleHasPermission',
  });
  return RoleHasPermission;
};
