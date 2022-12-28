'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PropertyUnit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PropertyUnit.belongsTo(models.Property, {foreignKey: 'property_id'})
      PropertyUnit.belongsTo(models.Unit, {foreignKey: 'unit_id'})
    }
  }
  PropertyUnit.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    property_id: DataTypes.UUID,
    unit_id: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'PropertyUnit',
    timestamps: false
  });
  return PropertyUnit;
};
