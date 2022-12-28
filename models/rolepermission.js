'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RolePermission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      RolePermission.belongsTo(models.Roles, {foreignKey:'role_id'});
      RolePermission.belongsTo(models.Permission, {foreignKey:'permission_id'});
    }
  }
  RolePermission.init({
    role_id: {
      type: DataTypes.UUID,
      field: 'role_id'
    },
    permission_id: {
      type:DataTypes.UUID,
      field:'permission_id'
    }
  }, {
    sequelize,
    modelName: 'RolePermission',
    timestamps: false
  });
  return RolePermission;
};
