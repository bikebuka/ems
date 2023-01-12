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
      Agent.belongsTo(models.User,{
        foreignKey:'userId',
        targetKey:'id',
        as: 'user'
      })
      //
      Agent.belongsTo(models.Agency,{
        foreignKey:'agencyId',
        targetKey:'id',
        as: 'agency'
      })
      // agent has many properties
      Agent.hasMany(models.Property,{
        foreignKey:'agentId',
        targetKey:'id',
        as:'properties'
      })
    }
  }
  Agent.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull:false,
      references: {
        model:'Users',
        key:'id'
      },
      onUpdate:'cascade',
      onDelete:'cascade'
    },
    agencyId: {
      type: DataTypes.INTEGER,
      allowNull:false,
      references: {
        model:'Agencies',
        key:'id'
      },
      onUpdate:'cascade',
      onDelete:'cascade'
    },
  }, {
    sequelize,
    modelName: 'Agent',
  });
  return Agent;
};
