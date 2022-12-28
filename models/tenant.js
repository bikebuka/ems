'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tenant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Tenant.belongsToMany(models.Users,{
        through: models.UserTenant,
        foreignKey:'tenant_id',
        otherKey:'user_id'
      })

      // Tenant.belongsToMany(models.Unit, {
      //   through: models.TenantUnit,
      //   foreignKey: 'tenant_id',
      //   otherKey: 'unit_id'
      // })
    }
  }
  Tenant.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email_address: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    username: DataTypes.STRING,
    description: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN,
    is_updated: DataTypes.BOOLEAN,
    is_deleted: DataTypes.BOOLEAN,
    created_by: DataTypes.UUID,
    agency_id: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'Tenant',
  });
  return Tenant;
};
