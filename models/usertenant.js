'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserTenant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserTenant.belongsTo(models.Users,{foreignKey: 'user_id'})
      UserTenant.belongsTo(models.Tenant,{foreignKey: 'tenant_id'})
    }
  }
  UserTenant.init({
    user_id: DataTypes.UUID,
    tenant_id: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'UserTenant',
    timestamps: false
  });
  return UserTenant;
};
