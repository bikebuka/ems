'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Payment.init({
    user_token: DataTypes.UUID,
    transaction_subtotal: DataTypes.DOUBLE,
    order: DataTypes.UUID,
    vendor_pay: DataTypes.DOUBLE,
    sms_cost: DataTypes.DOUBLE,
    transaction_id: DataTypes.UUID,
    customer_name: DataTypes.STRING,
    transaction_phone: DataTypes.STRING,
    transaction_amount: DataTypes.DOUBLE,
    transaction_date: DataTypes.DATE,
    transaction_type: DataTypes.STRING,
    callback_url: DataTypes.STRING,
    callback_status: DataTypes.STRING,
    status: DataTypes.STRING,
    vat: DataTypes.DOUBLE,
    type: DataTypes.STRING,
    ref: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Payment',
  });
  return Payment;
};