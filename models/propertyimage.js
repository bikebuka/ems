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
      PropertyImage.belongsToMany(models.Property, {
        through: 'PropertyPropertyImages',
        as: 'properties',
        foreignKey: 'propertyImageId'
      });
    }
  }
  PropertyImage.init({
    propertyId: {
      type: DataTypes.INTEGER,
      allowNull:false,
      references: {
        model:"Properties",
        key:"id"
      },
      onUpdate:'cascade',
      onDelete:'cascade'
    },
    imageURL: {
      type: DataTypes.STRING,
      allowNull:false,
    },
  }, {
    sequelize,
    modelName: 'PropertyImage',
  });
  return PropertyImage;
};
