'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LandOwner extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      LandOwner.belongsToMany(models.Users,{
        through: models.UserOwner,
        foreignKey:'owner_id',
        otherKey:'user_id'
      })
    }
  }
  LandOwner.init({
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
    is_active: DataTypes.BOOLEAN,
    is_deleted: DataTypes.BOOLEAN,
    is_updated: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'LandOwner',
  });
  return LandOwner;
};
