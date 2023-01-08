'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PropertyPropertyImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PropertyPropertyImage.init({
    propertyId: DataTypes.INTEGER,
    propertyImageId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PropertyPropertyImage',
  });
  return PropertyPropertyImage;
};