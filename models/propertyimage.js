'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PropertyImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PropertyImage.belongsTo(models.Property, {foreignKey: 'property_id'})
    }
  }
  PropertyImage.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    property_id: DataTypes.UUID,
    file_name: DataTypes.STRING,
    file_path: DataTypes.STRING,
    original_name: DataTypes.STRING,
    file_size: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PropertyImage',
  });
  return PropertyImage;
};
