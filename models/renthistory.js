'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RentHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  RentHistory.init({
    unit_id: DataTypes.UUID,
    tenant_id: DataTypes.UUID,
    amount_paid: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'RentHistory',
  });
  return RentHistory;
};