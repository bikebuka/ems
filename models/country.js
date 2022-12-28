'use strict';
const slugify = require('slugify');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Country extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Country.belongsToMany(models.Company,{
        through:models.CompanyCountry,
        foreignKey:'country_id',
        otherKey:'company_id'
      })

      Country.belongsToMany(models.Property,{
        through: models.PropertyCountry,
        foreignKey:'country_id',
        otherKey:'property_id'
      })
    }
  }
  Country.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    slug:{
      type:DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    short_name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Country',
    hooks: {
      beforeValidate(country, options) {
        country.slug = slugify(country.name,{lower: true})
      }
    }
  });
  return Country;
};
