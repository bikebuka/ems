'use strict';
const slugify = require('slugify');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Property extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Property.hasMany(models.PropertyImage, {foreignKey: 'property_id'})
      Property.belongsToMany(models.Category,{
        through: models.PropertyCategory,
        foreignKey:'property_id',
        otherKey:'category_id'
      })

      Property.belongsToMany(models.Country,{
        through: models.PropertyCountry,
        foreignKey:'property_id',
        otherKey:'country_id'
      })

      Property.belongsToMany(models.Users, {
        through: models.PropertyOwner,
        foreignKey: 'property_id',
        otherKey: 'owner_id'
      })

      Property.belongsToMany(models.Unit, {
        through: models.PropertyUnit,
        foreignKey:'property_id',
        otherKey: 'unit_id'
      })

      Property.belongsToMany(models.Company, {
        through: models.PropertyCompany,
        foreignKey: 'property_id',
        otherKey:'company_id'
      })

      // Property.belongsToMany(models.Agent, {
      //   through: models.AgentProperty,
      //   foreignKey:'property_id',
      //   otherKey: 'agent_id'
      // })

      Property.belongsTo(models.Users, {foreignKey: 'created_by'})
      Property.belongsTo(models.Company, {foreignKey: 'agency_id'})
    }
  }
  Property.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    property_name: DataTypes.STRING,
    property_slug: DataTypes.STRING,
    property_description: DataTypes.STRING(1000),
    property_location: DataTypes.STRING,
    property_code: DataTypes.STRING,
    created_by: DataTypes.UUID,
    agency_id: DataTypes.UUID,
    is_deleted: DataTypes.BOOLEAN,
    is_updated: DataTypes.BOOLEAN,
    updated_by: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'Property',
    hooks: {
      beforeValidate(instance, options) {
        instance.property_slug = slugify(instance.property_name, {lower: true})
      }
    }
  });
  return Property;
};
