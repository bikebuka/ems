'use strict';
const {
  Model
} = require('sequelize');
const slugify = require('slugify')
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Category.belongsToMany(models.Property,{
        through: models.PropertyCategory,
        foreignKey:'category_id',
        otherKey:'property_id'
      })
    }
  }
  Category.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    slug: DataTypes.STRING,
    description: DataTypes.STRING,
    created_by: DataTypes.UUID,
    updated_by: DataTypes.UUID,
    is_active: DataTypes.BOOLEAN,
    is_updated: DataTypes.BOOLEAN,
    is_deleted: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Category',
    hooks: {
      beforeValidate(instance, options) {
        instance.slug = slugify(instance.name, {lower: true})
      }
    }
  });
  return Category;
};
