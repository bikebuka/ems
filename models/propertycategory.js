'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PropertyCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PropertyCategory.belongsTo(models.Property,{foreignKey:'property_id'})
      PropertyCategory.belongsTo(models.Category, {foreignKey: 'category_id'})
    }
  }
  PropertyCategory.init({
    property_id: {
      type:DataTypes.UUID,
      field: 'property_id'
    },
    category_id: {
      type:DataTypes.UUID,
      field: 'category_id'
    }
  }, {
    sequelize,
    modelName: 'PropertyCategory',
    timestamps: false
  });
  return PropertyCategory;
};
