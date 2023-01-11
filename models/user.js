'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //
      User.hasOne(models.Agent,{
        foreignKey:'userId',
        targetKey:'id',
        as: 'user'
      })
    }
  }
  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    middleName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      isEmail:true,
      unique:true
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull:false
    },
    status: {
      type: DataTypes.ENUM("PENDING","SUSPENDED","REJECTED","APPROVED"),
      defaultValue:"PENDING"
    },
    userType: {
      type: DataTypes.ENUM("NORMAL","AGENT","AGENCY","LANDLORD","SUPER_ADMIN","ADMIN","TENANT"),
      allowNull: false,
      defaultValue: "NORMAL"
    },
    approvedBy: {
      type: DataTypes.INTEGER
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
