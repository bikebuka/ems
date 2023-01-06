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
      Agent.belongsTo(models.Users, {foreignKey: 'user_id'})
      //
      Agent.belongsTo(models.Users, {foreignKey: 'created_by'})
      //
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
    user_id: {
      type:DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
    },
    agency_id: {
      type:DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Agencies',
        key: 'id'
      },
    },
    created_by:{
      type:DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    status: DataTypes.ENUM("Pending",'Suspended','Approved','Rejected'),
  }, {
    sequelize,
    modelName: 'Agent',
  });
  return Agent;
};
