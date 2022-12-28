'use strict';
const {
  Model
} = require('sequelize');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
module.exports = (sequelize, DataTypes) => {
  class RefreshToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      RefreshToken.belongsTo(models.Users, {foreignKey:'id'})
    }
  }
  RefreshToken.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    token: DataTypes.STRING,
    expiry_date: DataTypes.DATE,
    user_id: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'RefreshToken',
  });

  RefreshToken.createToken = async function (user) {
    let expiredAt = new Date();
    expiredAt.setSeconds(expiredAt.getSeconds() + process.env.JWT_REFRESH_EXPIRATION || 5184000);
    let _token = uuidv4();

    let refreshToken = await this.create({
      token: _token,
      user_id: user.id,
      expiry_date: expiredAt.getTime()
    })
    return refreshToken.token
  }

  RefreshToken.verifyExpiration = (token) => {
    return token.expiry_date.getTime() < new Date().getTime();
  }

  return RefreshToken;
};
