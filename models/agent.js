'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Agent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Agent.belongsTo(models.Users, {foreignKey: 'created_by'})
      Agent.belongsTo(models.Company, {foreignKey:'agency_id'})

      Agent.belongsToMany(models.Users,{
        through: models.UserAgent,
        foreignKey:'agent_id',
        otherKey:'user_id'
      })

      Agent.belongsToMany(models.Property,{
        through: models.AgentProperty,
        foreignKey:'agent_id',
        otherKey:'property_id'
      })

    }
  }
  Agent.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email_address: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    username: DataTypes.STRING,
    description: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN,
    is_updated: DataTypes.BOOLEAN,
    is_deleted: DataTypes.BOOLEAN,
    created_by: DataTypes.UUID,
    agency_id: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'Agent',
  });
  return Agent;
};
