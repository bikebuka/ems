'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Rent.belongsTo(models.Unit,{
        foreignKey:'unitId',
        as:'unit'
      })
      //
      Rent.belongsTo(models.Tenant,{
        foreignKey:'tenantId',
        as:'tenant'
      })
    }
  }
  Rent.init({
    unitId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Units',
        key:'id'
      },
      onUpdate:'cascade',
      onDelete:'cascade',
    },
    tenantId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Tenants',
        key:'id'
      },
      onUpdate:'cascade',
      onDelete:'cascade',
    },
    amountPaid: {
      type: DataTypes.DOUBLE
    },
  }, {
    sequelize,
    modelName: 'Rent',
  });
  return Rent;
};
