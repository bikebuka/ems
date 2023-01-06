'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AgencyProperty extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      AgencyProperty.belongsTo(models.Agency,{
        foreignKey: 'agency_id'
      })
      AgencyProperty.belongsTo(models.Property,{
        foreignKey:'property_id'
      })
      AgencyProperty.belongsTo(models.Agent,{
        foreignKey:'agent_id'
      })
    }
  }
  AgencyProperty.init({
    agency_id: DataTypes.INTEGER,
    property_id: DataTypes.UUID,
    agent_id: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'AgencyProperty',
  });
  return AgencyProperty;
};