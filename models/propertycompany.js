'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PropertyCompany extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PropertyCompany.belongsTo(models.Property, {foreignKey:'property_id'})
      PropertyCompany.belongsTo(models.Company, {foreignKey: 'company_id'})
    }
  }
  PropertyCompany.init({
    property_id: {
      type:DataTypes.UUID,
      field:'property_id'
    },
    company_id: {
      type:DataTypes.UUID,
      field: 'company_id'
    }
  }, {
    sequelize,
    modelName: 'PropertyCompany',
    timestamps: false
  });
  return PropertyCompany;
};
