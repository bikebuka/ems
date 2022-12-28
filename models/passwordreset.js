'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PasswordReset extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PasswordReset.belongsTo(models.Users, {foreignKey:'user_id'})
    }
  }
  PasswordReset.init({
    user_id: DataTypes.UUID,
    provider: DataTypes.STRING,
    password_reset_token: DataTypes.STRING,
    password_reset_at: DataTypes.STRING,
    isUsed: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'PasswordReset',
  });
  return PasswordReset;
};
