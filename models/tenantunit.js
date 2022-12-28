'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TenantUnit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here\
      // TenantUnit.belongsTo(models.Tenant, {foreignKey: 'tenant_id'})
      // TenantUnit.belongsTo(models.Unit, {foreignKey:'unit_id' })
    }
  }
  TenantUnit.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    tenant_id: DataTypes.UUID,
    unit_id: DataTypes.UUID,
    current_owner: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    date_rented: {
      type: DataTypes.DATE,
      defaultValue: new Date()
    },
    date_left: {
      type: DataTypes.DATE,
      defaultValue: null
    }
  }, {
    sequelize,
    modelName: 'TenantUnit',
    timestamps: false
  });
  return TenantUnit;
};
