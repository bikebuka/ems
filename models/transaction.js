'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Transaction.init({
    transactionId: {
      type: DataTypes.STRING
    },
    transactionCode: {
      allowNull: false,
      type: DataTypes.STRING
    },
    transactionDate: {
      type: DataTypes.DATE
    },
    unitId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Units',
        key:'id'
      },
    },
    payerId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key:'id'
      },
    },
    amount: {
      type: DataTypes.DOUBLE
    },
    paymentMode: {
      allowNull: false,
      type: DataTypes.ENUM("M-PESA","CASH","T-KASH","AIRTEL-MONEY","CARD")
    },
    accountNumber: {
      allowNull: false,
      type: DataTypes.STRING
    },
    accountReference: {
      allowNull: false,
      type: DataTypes.STRING
    },
    merchantRequestId: {
      allowNull: false,
      type: DataTypes.STRING
    },
    checkoutRequestId: {
      allowNull: false,
      type: DataTypes.STRING
    },
    responseCode: {
      allowNull: false,
      type: DataTypes.STRING
    },
    resultCode: {
      allowNull: false,
      type: DataTypes.STRING
    },
    attachment: {
      allowNull: false,
      type: DataTypes.STRING
    },
    promiseToPay: {
      type: DataTypes.BOOLEAN,
      default:false
    },
    recipientBankAccountNumber: {
      allowNull: false,
      type: DataTypes.STRING
    },
    errorCode: {
      allowNull: false,
      type: DataTypes.STRING
    },
    errorMessage: {
      allowNull: false,
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};
