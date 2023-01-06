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
      Agent.belongsTo(models.Users, {
        foreignKey: 'created_by',
        otherKey: 'user_id'
      })
      Agent.belongsTo(models.Agency, {foreignKey:'agency_id'})
    }
  }
  Agent.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    user_id: DataTypes.UUID,
    agency_id: DataTypes.INTEGER,
    property_id:{
      type:DataTypes.UUID,
      unique:true,
    },
    created_by: DataTypes.UUID,
    status: DataTypes.ENUM("Pending",'Suspended','Approved','Rejected'),
  }, {
    sequelize,
    modelName: 'Agent',
  });
  return Agent;
};
