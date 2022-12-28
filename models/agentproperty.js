'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AgentProperty extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      AgentProperty.belongsTo(models.Agent,{foreignKey:'agent_id'})
      AgentProperty.belongsTo(models.Property, {foreignKey: 'property_id'})
    }
  }
  AgentProperty.init({
    agent_id: DataTypes.UUID,
    property_id: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'AgentProperty',
    timestamps: false
  });
  return AgentProperty;
};
