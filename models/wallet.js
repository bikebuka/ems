'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Wallet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Wallet.belongsTo(models.User,{
        foreignKey:'userId',
        as: 'accountHolder'
      })
      // since
      Wallet.belongsTo(models.Unit,{
        foreignKey:'unitId',
        as:'unit'
      })
    }
  }
  Wallet.init({
    userId: {
      allowNull: false,
      unique:true,
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key:'id'
      },
    },
    unitId: {
      allowNull: false,
      unique:false,
      type: DataTypes.INTEGER,
      references: {
        model: 'Units',
        key:'id'
      },
    },
    agencyId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Agencies',
        key:'id'
      },
    },
    accountBalance: {
      allowNull: false,
      type: DataTypes.DOUBLE,
      default:0
    },
    status:{
      type:DataTypes.ENUM("ACTIVE","INACTIVE"),
      default:"ACTIVE"
    },
  }, {
    sequelize,
    modelName: 'Wallet',
  });
  return Wallet;
};
