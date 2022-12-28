'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserRoles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserRoles.belongsTo(models.Roles, {foreignKey:'role_id'});
      UserRoles.belongsTo(models.Users, {foreignKey:'user_id'});
    }
  }
  UserRoles.init({
    role_id: {
      type: DataTypes.UUID,
      field: 'role_id'
    },
    user_id: {
      type:DataTypes.UUID,
      field:'user_id'
    }
  }, {
    sequelize,
    modelName: 'UserRoles',
    timestamps: false
  });
  return UserRoles;
};