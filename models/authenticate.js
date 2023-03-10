'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Authenticate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Authenticate.init({
    emailAddress: DataTypes.STRING,
    token: DataTypes.STRING,
    isUsed: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Authenticate',
  });
  return Authenticate;
};