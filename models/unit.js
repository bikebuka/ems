'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Unit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Unit.init({
    propertyId:{
      type:DataTypes.INTEGER,
      references: {
        model:"Properties",
        key:"id"
      },
      onUpdate:"cascade",
      onDelete:"cascade",
    },
    name: {
      type: DataTypes.STRING
    },
    floor: {
      type: DataTypes.STRING
    },
    rentAmount: {
      type: DataTypes.DOUBLE
    },
    bedrooms: {
      type: DataTypes.INTEGER
    },
    bathrooms: {
      type: DataTypes.INTEGER
    },
    totalRooms: {
      type: DataTypes.INTEGER
    },
    squareFoot: {
      type: DataTypes.STRING
    },
    counter: {
      type:DataTypes.INTEGER,
      defaultValue: 1
    },
    isRented: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    sequelize,
    modelName: 'Unit',
  });
  return Unit;
};
