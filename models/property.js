'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Property extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Property.hasMany(models.Unit, {
        foreignKey: 'propertyId',
        as: 'units'
      });
    }
  }
  Property.init({
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model:'Users',
        key:'id'
      },
      onUpdate:'cascade',
      onDelete:'cascade'
    },
    agencyId: {
      type: DataTypes.INTEGER,
      references: {
        model:'Agencies',
        key:'id'
      },
      onUpdate:'cascade',
      onDelete:'cascade'
    },
    totalUnits: {
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING
    },
    title: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.TEXT
    },
    location: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.ENUM("ACTIVE","INACTIVE"),
      defaultValue:"ACTIVE"
    },
  }, {
    sequelize,
    modelName: 'Property',
  });
  return Property;
};
