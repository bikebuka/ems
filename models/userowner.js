'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserOwner extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserOwner.belongsTo(models.Users, {foreignKey: 'user_id'});
      UserOwner.belongsTo(models.LandOwner, {foreignKey: 'owner_id'});
    }
  }
  UserOwner.init({
    user_id: DataTypes.UUID,
    owner_id: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'UserOwner',
    timestamps: false
  });
  return UserOwner;
};
