'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CompanyCountry extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CompanyCountry.belongsTo(models.Company,{foreignKey:'company_id'})
      CompanyCountry.belongsTo(models.Country,{foreignKey: 'country_id'})
    }
  }
  CompanyCountry.init({
    company_id: DataTypes.UUID,
    country_id: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'CompanyCountry',
    timestamps: false
  });
  return CompanyCountry;
};
