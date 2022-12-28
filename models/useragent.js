'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserAgent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserAgent.belongsTo(models.Users, {foreignKey: 'user_id'});
      UserAgent.belongsTo(models.Agent, {foreignKey: 'agent_id'});
    }
  }
  UserAgent.init({
    user_id: DataTypes.UUID,
    agent_id: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'UserAgent',
    timestamps: false
  });
  return UserAgent;
};
