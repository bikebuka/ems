'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PropertyOwner extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PropertyOwner.belongsTo(models.Property, {foreignKey: 'id'})
      PropertyOwner.belongsTo(models.Users, {foreignKey: 'owner_id'})
    }
  }
  PropertyOwner.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    property_id: {
      type:DataTypes.UUID,
      field: 'property_id'
    },
    owner_id: {
      type:DataTypes.UUID,
      field: 'owner_id'
    }
  }, {
    sequelize,
    modelName: 'PropertyOwner',
    timestamps: false
  });
  return PropertyOwner;
};
