'use strict';
const models=require("../models")
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Unit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Unit.belongsTo(models.UnitType, {foreignKey:'unit_type_id'})
      Unit.belongsToMany(models.Property, {
        through: models.PropertyUnit,
        foreignKey: 'unit_id',
        otherKey: 'property_id'
      })

      // Unit.belongsToMany(models.Tenant, {
      //   through: models.TenantUnit,
      //   foreignKey: 'unit_id',
      //   otherKey: 'tenant_id'
      // })
    }
  }
  Unit.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    unit_name: DataTypes.STRING,
    unit_floor: DataTypes.STRING,
    rent_amount: DataTypes.DOUBLE,
    unit_type_id: DataTypes.UUID,
    bedrooms: DataTypes.INTEGER,
    bathrooms: DataTypes.INTEGER,
    total_rooms: DataTypes.INTEGER,
    square_foot: DataTypes.INTEGER,
    created_by: {
      type:DataTypes.UUID,
      // async get() {
      //   const id = this.getDataValue('created_by');
      //   const user = await models.Users?.findByPk(id)
      //   console.log("users***************************")
      //   console.log(models)
      //   console.log("***************************")
      //   return id ? user : {};
      // }
    },
    updated_by: DataTypes.UUID,
    is_deleted: DataTypes.BOOLEAN,
    is_rented: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Unit',
  });
  return Unit;
};
