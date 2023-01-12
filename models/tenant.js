'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tenant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // tenant has a single unit
      Tenant.hasOne(models.Unit,{
        foreignKey: "tenantId",
        as: 'unit'
      })
      //
      Tenant.belongsTo(models.User,{
        foreignKey: "userId",
        as: 'user'
      })
      //
      Tenant.hasMany(models.Rent,{
        foreignKey:'tenantId',
        as:'rents'
      })
    }
  }
  Tenant.init({
    userId: {
      type: DataTypes.INTEGER,
      unique:true,
      references: {
        model:"Users",
        key:'id'
      },
      onUpdate:'cascade',
      onDelete:'cascade'
    },
    unitId: {
      type: DataTypes.INTEGER,
      unique:true,
      references: {
        model:"Units",
        key:'id'
      },
      onUpdate:'cascade',
      onDelete:'cascade'
    },
    checkIn: {
      type: DataTypes.DATE,
      defaultValue: Date.now()
    },
    checkOut: {
      type: DataTypes.DATE
    },
    status: {
      type: DataTypes.ENUM("PAID","PARTIALLY_PAID","PENDING_PAYMENT"),
      defaultValue:"PENDING_PAYMENT"
    },
  }, {
    sequelize,
    modelName: 'Tenant',
  });
  return Tenant;
};
