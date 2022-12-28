'use strict';
const slugify = require('slugify')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Company extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    static associate(models) {
      // define association here
      Company.hasMany(models.Agent, {foreignKey:'agency_id'})
      Company.hasMany(models.Property, {foreignKey: 'agency_id'})
      Company.belongsToMany(models.Users, {
        through: models.UserCompany,
        foreignKey:'company_id',
        otherKey:'user_id'
      })

      Company.belongsToMany(models.Country,{
        through:models.CompanyCountry,
        foreignKey:'company_id',
        otherKey:'country_id'
      })

      Company.belongsToMany(models.Property,{
        through: models.PropertyCompany,
        foreignKey:'company_id',
        otherKey:'property_id'
      })
    }
  }
  Company.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    company_name: DataTypes.STRING,
    company_slug: DataTypes.STRING,
    office_email: DataTypes.STRING,
    office_phone: DataTypes.STRING,
    office_cell: DataTypes.STRING,
    office_name: DataTypes.STRING,
    building_name: DataTypes.STRING,
    road_street: DataTypes.STRING,
    office_floor: DataTypes.STRING,
    website: DataTypes.STRING,
    address_1: DataTypes.STRING,
    address_2: DataTypes.STRING,
    description: DataTypes.STRING,
    created_by: DataTypes.STRING,
    is_agency: DataTypes.BOOLEAN,
    is_active: DataTypes.BOOLEAN,
    is_deleted: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Company',
    hooks: {
      beforeValidate(instance, options) {
        instance.company_slug = slugify(instance.company_name, {lower: true})
      }
    }
  });
  return Company;
};
