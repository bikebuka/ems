'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserRole extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //
      UserRole.belongsTo(models.Role, {foreignKey:'roleId'});
      UserRole.belongsTo(models.User, {foreignKey:'userId'});
    }
  }
  UserRole.init({
    roleId: {
      type: DataTypes.INTEGER,
      allowNull:false,
      references: {
        model: "Roles",
        key:"id"
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull:false,
      references: {
        model: "Permissions",
        key:"id"
      }
    },
  }, {
    sequelize,
    modelName: 'UserRole',
  });
  return UserRole;
};
