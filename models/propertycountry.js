'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PropertyCountry extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PropertyCountry.belongsTo(models.Country, {foreignKey: 'country_id'})
      PropertyCountry.belongsTo(models.Property,{foreignKey: 'property_id'})
    }
  }
  PropertyCountry.init({
    property_id: {
      type:DataTypes.UUID,
      field: 'property_id'
    },
    country_id: {
      type:DataTypes.UUID,
      field: 'country_id'
    }
  }, {
    sequelize,
    modelName: 'PropertyCountry',
    timestamps: false
  });
  return PropertyCountry;
};
