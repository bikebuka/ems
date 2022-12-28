'use strict';
const {
  Model
} = require('sequelize');
const slugify = require("slugify");
module.exports = (sequelize, DataTypes) => {
  class UnitType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UnitType.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    unit_type_name: DataTypes.STRING,
    unit_type_slug: DataTypes.STRING,
    unit_type_description: DataTypes.STRING,
    created_by: DataTypes.UUID,
    updated_by: DataTypes.UUID,
    deleted_by: DataTypes.UUID,
    is_active: DataTypes.BOOLEAN,
    is_updated: DataTypes.BOOLEAN,
    is_deleted: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'UnitType',
    hooks: {
      beforeValidate(instance, options) {
        instance.unit_type_slug = slugify(instance.unit_type_name, {lower: true})
      }
    }
  });
  return UnitType;
};
